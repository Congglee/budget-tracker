"use client";

import AddCategoryForm from "@/components/category/add-category-form";
import ComboboxInput from "@/components/form/combobox-input";
import DatePickerInput from "@/components/form/date-picker-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { transactionTypesOptions } from "@/config/options";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, getCurrencyLabel } from "@/lib/utils";
import { AddTransactionSchema } from "@/schemas/transaction";
import { ExtendedCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction, TransactionType, UserSettings } from "@prisma/client";
import { LoaderCircle, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TransactionAddFormProps {
  categories: ExtendedCategory[];
  userSettings: UserSettings;
  transaction?: Transaction;
  heading?: string;
  description?: string;
}

type FormData = z.infer<typeof AddTransactionSchema>;

export default function AddTransactionForm({
  categories,
  userSettings,
  transaction,
  heading,
  description,
}: TransactionAddFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      budget: "",
      date: new Date(),
      description: "",
      type: TransactionType.INCOME,
    },
  });
  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
    setError,
  } = form;

  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] =
    useState<boolean>(false);

  const router = useRouter();
  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);
  const type = watch("type");
  const isExpenseType = type === TransactionType.EXPENSE;

  const categoriesOptions = useMemo(() => {
    return categories.length > 0
      ? categories
          .filter((category) => category.type === type)
          .map((category) => ({
            value: category.id,
            label: `${category.icon} ${category.name}`,
          }))
      : [];
  }, [categories, type]);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id === watch("category"));
  }, [categories, watch("category")]);

  const budgetsOptions = useMemo(() => {
    return selectedCategory
      ? selectedCategory.budgets.map((budget) => ({
          value: budget.id,
          label: `${budget.name} (Remaining: ${budget.remaining} ${userCurrencyLabel})`,
        }))
      : [];
  }, [selectedCategory]);

  useEffect(() => {
    if (transaction) {
      setValue("name", transaction.name);
      setValue("amount", transaction.amount);
      setValue("category", transaction.categoryId);
      setValue("budget", transaction.budgetId ? transaction.budgetId : "");
      setValue("date", new Date(transaction.date));
      setValue("description", transaction.description as string);
      setValue("type", transaction.type as TransactionType);
    }
  }, [transaction, setValue]);

  const onSelectDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("date", date);
      }
    },
    [setValue]
  );

  const addTransaction = async (values: FormData) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<Transaction>(response);
      if (response.ok) {
        toast.success(result.message);
        router.refresh();
        reset();
      }
    } catch (error: any) {
      handleErrorResponse({ error, setError });
    }
  };

  const updateTransaction = async (values: FormData) => {
    try {
      const response = await fetch(`/api/transactions/${transaction?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorResponse({ error, setError });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (transaction) {
      await updateTransaction(values);
    } else {
      await addTransaction(values);
    }
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{heading || "Create a new transaction"}</CardTitle>
              <CardDescription>
                {description ||
                  "This will add a new transaction to your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Transaction name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Transaction description..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel htmlFor="amount">
                        Amount {`(${userCurrencyLabel})`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="amount"
                          placeholder="Transaction amount..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel htmlFor="type">Type</FormLabel>
                      <ComboboxInput
                        value={field.value}
                        options={transactionTypesOptions}
                        onSelect={(value) => {
                          setValue("type", value as TransactionType);
                          setValue("category", "");
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        "col-span-2 overflow-hidden",
                        isExpenseType && "sm:col-span-1"
                      )}
                    >
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <ComboboxInput
                        value={field.value}
                        options={categoriesOptions}
                        onSelect={(value) => {
                          setValue("category", value);
                          setValue("budget", "");
                        }}
                        placeholder="Select category"
                        emptyText="No category found"
                      >
                        <Button
                          variant="ghost"
                          className="rounded-none w-full"
                          onClick={() => setAddCategoryDrawerOpen(true)}
                        >
                          <PlusSquare className="mr-2 h-4 w-4" />
                          Create new
                        </Button>
                      </ComboboxInput>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isExpenseType && (
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1 overflow-hidden">
                        <FormLabel htmlFor="budget">Budget</FormLabel>
                        <ComboboxInput
                          value={field.value}
                          options={budgetsOptions}
                          onSelect={(value) => setValue("budget", value)}
                          placeholder="Select budget"
                          emptyText="No budget found"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor="type">Date</FormLabel>
                      <DatePickerInput
                        value={field.value}
                        onSelect={onSelectDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start md:items-center md:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full md:w-auto"
                disabled={isSubmitting}
                onClick={() =>
                  reset({
                    name: transaction?.name || "",
                    amount: transaction?.amount || 0,
                    category: transaction?.categoryId || "",
                    date: new Date(transaction?.date || new Date()),
                    description: transaction?.description || "",
                    type: (transaction?.type as TransactionType) || "income",
                  })
                }
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <AddCategoryForm
        open={addCategoryDrawerOpen}
        onOpenChange={setAddCategoryDrawerOpen}
        type={watch("type")}
      />
    </>
  );
}
