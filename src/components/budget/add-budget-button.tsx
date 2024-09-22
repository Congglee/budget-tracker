"use client";

import { useAppContext } from "@/app/app-context";
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
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, getCurrencyLabel } from "@/lib/utils";
import { AddBudgetSchema } from "@/schemas/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Budget,
  Category,
  TransactionType,
  UserSettings,
} from "@prisma/client";
import { LoaderCircle, Plus, PlusCircle, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddBudgetButtonProps {
  userSettings: UserSettings;
  categories: Category[];
}

type FormData = z.infer<typeof AddBudgetSchema>;

export default function AddBudgetButton({
  userSettings,
  categories,
}: AddBudgetButtonProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
      start_date: undefined,
      end_date: undefined,
      category: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
    setError,
  } = form;

  const [addBudgetDialogOpen, setAddBudgetDialogOpen] =
    useState<boolean>(false);
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] =
    useState<boolean>(false);

  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);
  const { trigger, setTrigger } = useAppContext();
  const router = useRouter();

  const categoriesOptions = useMemo(() => {
    return categories.length > 0
      ? categories
          .filter((category) => category.type === TransactionType.EXPENSE)
          .map((category) => ({
            value: category.id,
            label: `${category.icon} ${category.name}`,
          }))
      : [];
  }, [categories]);

  useEffect(() => {
    if (!addBudgetDialogOpen) {
      reset();
    }
  }, [addBudgetDialogOpen, reset]);

  const onSelectStartDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("start_date", date);
      }
    },
    [setValue]
  );

  const onSelectEndDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("end_date", date);
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<Budget>(response);
      if (response.ok) {
        toast.success(result.message);
        setAddBudgetDialogOpen(false);
        router.refresh();
        setTrigger(!trigger);
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
          "border-primary/50 hover:bg-primary/70 bg-primary text-primary-foreground"
        )}
        onClick={() => setAddBudgetDialogOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New budget
      </Button>
      <Credenza
        open={addBudgetDialogOpen}
        onOpenChange={setAddBudgetDialogOpen}
      >
        <CredenzaContent className="p-0">
          <div className="overflow-y-auto scroll max-h-[650px] text-foreground p-6 space-y-4">
            <CredenzaHeader>
              <CredenzaTitle>
                Create a new <span className="text-primary">budget</span>
              </CredenzaTitle>
              <CredenzaDescription>
                This will add a new budget to your account.
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
                            placeholder="Budget name..."
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
                          Amount {`(${userCurrencyLabel})`}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            id="amount"
                            min={0}
                            placeholder="Budget amount..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel htmlFor="type">Start Date</FormLabel>
                        <DatePickerInput
                          value={field.value}
                          onSelect={onSelectStartDate}
                          enableFutureTime={true}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel htmlFor="type">End Date</FormLabel>
                        <DatePickerInput
                          value={field.value}
                          onSelect={onSelectEndDate}
                          enableFutureTime={true}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="type">Expense Category</FormLabel>
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
                </CredenzaBody>
                <CredenzaFooter className="mt-8 sm:space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    disabled={isSubmitting}
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
        type={TransactionType.EXPENSE}
      />
    </>
  );
}
