"use client";

import AddCategoryForm from "@/components/category/add-category-form";
import ComboboxInput from "@/components/form/combobox-input";
import DatePickerInput from "@/components/form/date-picker-input";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
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
import { LoaderCircle, Plus, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddTransactionButtonProps {
  categories: ExtendedCategory[];
  userSettings: UserSettings;
  btnClassName?: string;
}

type FormData = z.infer<typeof AddTransactionSchema>;

export default function AddTransactionButton({
  categories,
  userSettings,
  btnClassName,
}: AddTransactionButtonProps) {
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

  const [addTransactionDialogOpen, setAddTransactionDialogOpen] =
    useState<boolean>(false);
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
    if (!addTransactionDialogOpen) {
      reset();
    }
  }, [addTransactionDialogOpen, reset]);

  const onSelectDateChange = useCallback(
    (date: Date) => {
      if (date) {
        setValue("date", date);
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<Transaction>(response);
      if (response.ok) {
        toast.success(result.message);
        setAddTransactionDialogOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "border-primary/50 hover:bg-primary/70 bg-primary text-primary-foreground",
          btnClassName
        )}
        onClick={() => setAddTransactionDialogOpen(true)}
      >
        New transaction 💱
      </Button>
      <Credenza
        open={addTransactionDialogOpen}
        onOpenChange={setAddTransactionDialogOpen}
      >
        <CredenzaContent className="p-0">
          <div className="overflow-y-auto scroll max-h-[650px] text-foreground p-6 space-y-4">
            <CredenzaHeader>
              <CredenzaTitle>
                Create a new <span className="text-primary">transaction</span>
              </CredenzaTitle>
              <CredenzaDescription>
                This will add a new transaction to your account.
              </CredenzaDescription>
            </CredenzaHeader>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <CredenzaBody className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
                          "col-span-2",
                          isExpenseType && "sm:col-span-1"
                        )}
                      >
                        <FormLabel htmlFor="category">Category</FormLabel>
                        <ComboboxInput
                          value={field.value}
                          options={categoriesOptions}
                          onSelect={(value) => setValue("category", value)}
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
                        <FormItem className="col-span-2 sm:col-span-1">
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
                          onSelect={onSelectDateChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CredenzaBody>
                <CredenzaFooter className="mt-8 sm:space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    <span>Submit</span>
                  </Button>
                </CredenzaFooter>
              </form>
            </Form>
          </div>
        </CredenzaContent>
      </Credenza>
      <AddCategoryForm
        open={addCategoryDrawerOpen}
        onOpenChange={setAddCategoryDrawerOpen}
        type={type}
      />
    </>
  );
}
