"use client";

import { useAppContext } from "@/app/app-context";
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
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { AddTransactionSchema } from "@/schemas/transaction";
import { ExtendedBudget } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCurrencyLabel?: string;
  budget: ExtendedBudget;
}

type FormData = z.infer<typeof AddTransactionSchema>;

export default function AddExpenseDialog({
  open,
  onOpenChange,
  userCurrencyLabel,
  budget,
}: AddExpenseDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
      type: TransactionType.EXPENSE,
      budget: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
    setError,
  } = form;

  const router = useRouter();
  const { trigger, setTrigger } = useAppContext();

  useEffect(() => {
    if (budget) {
      setValue("category", budget.categoryId);
      setValue("budget", budget.id);
    }
  }, [budget, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        amount: 0,
        description: "",
        date: new Date(),
        type: TransactionType.EXPENSE,
        budget: budget ? budget.id : "",
        category: budget ? budget.categoryId : "",
      });
    }
  }, [open, reset]);

  const onSelectDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("date", date);
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        onOpenChange(false);
        router.refresh();
        setTrigger(!trigger);
      }
    } catch (error) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="p-0">
        <div className="overflow-y-auto md:w-[520px] w-full text-foreground p-6 space-y-4">
          <CredenzaHeader>
            <CredenzaTitle>
              Add a <span className="text-primary">expense</span> transaction to
              budget
            </CredenzaTitle>
            <CredenzaDescription>
              This will add a new expense transaction to the selected budget.
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
                          className="h-24"
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
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor="amount">
                        Amount {`(${userCurrencyLabel || "USD"})`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="amount"
                          min={0}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel htmlFor="type">Date</FormLabel>
                      <DatePickerInput
                        value={field.value}
                        onSelect={onSelectDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel htmlFor="category">Expense Category</FormLabel>
                      <ComboboxInput
                        value={field.value}
                        options={[
                          {
                            value: budget.categoryId,
                            label: budget.category.name,
                          },
                        ]}
                        onSelect={(value) => setValue("category", value)}
                        placeholder="Select category"
                        emptyText="No category found"
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
                  onClick={() =>
                    reset({
                      name: "",
                      amount: 0,
                      description: "",
                      date: new Date(),
                      type: TransactionType.EXPENSE,
                      budget: budget.id,
                      category: budget.categoryId,
                    })
                  }
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
  );
}
