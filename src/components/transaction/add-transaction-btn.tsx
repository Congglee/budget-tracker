"use client";

import AddCategoryBtn from "@/components/category/add-category-btn";
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
import { transactionCreateSchema } from "@/lib/validations/transaction";
import { TransactionType } from "@/types";
import { CustomResponse } from "@/types/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Transaction, UserSettings } from "@prisma/client";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddTransactionBtnProps {
  categories: Category[];
  userSettings: UserSettings;
  btnClassName?: string;
}

type FormData = z.infer<typeof transactionCreateSchema>;

export default function AddTransactionBtn({
  categories,
  userSettings,
  btnClassName,
}: AddTransactionBtnProps) {
  const [addTransactionDialogOpen, setAddTransactionDialogOpen] =
    useState(false);
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
      type: "income",
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
  const router = useRouter();
  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);

  const categoriesOptions = useMemo(() => {
    return categories.length > 0
      ? categories
          .filter((category) => category.type === watch("type"))
          .map((category) => ({
            value: category.id,
            label: `${category.icon} ${category.name}`,
          }))
      : [];
  }, [categories, watch("type")]);

  useEffect(() => {
    if (!addTransactionDialogOpen) {
      reset();
    }
  }, [addTransactionDialogOpen, reset]);

  const handleDateChange = useCallback(
    (date: Date) => {
      if (date) {
        setValue("date", date);
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payloadData = {
        ...data,
        date: data.date.toISOString(),
      };
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });
      const result = await parseApiResponse<CustomResponse<Transaction>>(
        response
      );
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
          "border-primary/50 hover:bg-primary/70 bg-primary capitalize text-primary-foreground w-[16.25rem]",
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
        <CredenzaContent className="sm:max-w-[525px] p-0">
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
                <CredenzaBody className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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
                      <FormItem>
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
                      <FormItem>
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="type">Category</FormLabel>
                          <ComboboxInput
                            value={field.value}
                            options={categoriesOptions}
                            onSelect={(value) => setValue("category", value)}
                            placeholder="Select category"
                            emptyText="No category found"
                          >
                            <AddCategoryBtn
                              className="rounded-none"
                              open={addCategoryDrawerOpen}
                              onOpenChange={setAddCategoryDrawerOpen}
                            />
                          </ComboboxInput>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="type">Date</FormLabel>
                          <DatePickerInput
                            value={field.value}
                            onChange={handleDateChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CredenzaBody>
                <CredenzaFooter className="mt-8 sm:space-x-4">
                  <Button
                    type="button"
                    variant="outline"
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
        type={watch("type")}
      />
    </>
  );
}
