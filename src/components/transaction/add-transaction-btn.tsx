"use client";

import AddCategoryBtn from "@/components/category/add-category-btn";
import AddCategoryForm from "@/components/category/add-category-form";
import Combobox from "@/components/combobox";
import DatePicker from "@/components/date-picker";
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
import { transactionTypesOptions } from "@/config/options";
import { transactionCreateSchema } from "@/lib/validations/transaction";
import { TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddTransactionBtnProps {
  categories: Category[];
}

type FormData = z.infer<typeof transactionCreateSchema>;

export default function AddTransactionBtn({
  categories,
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
  const { handleSubmit, watch, setValue, reset } = form;

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

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <Button
        variant="outline"
        className="border-primary/50 hover:bg-primary/70 bg-primary/95 capitalize"
        onClick={() => setAddTransactionDialogOpen(true)}
      >
        New transaction 💱
      </Button>
      <Credenza
        open={addTransactionDialogOpen}
        onOpenChange={setAddTransactionDialogOpen}
      >
        <CredenzaContent>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="amount">Amount</FormLabel>
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
                      <Combobox
                        value={field.value}
                        options={transactionTypesOptions}
                        onSelect={(value) =>
                          setValue("type", value as TransactionType)
                        }
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
                        <Combobox
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
                        </Combobox>
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
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CredenzaBody>
              <CredenzaFooter className="mt-8 sm:space-x-4">
                <Button type="button" variant="outline" onClick={() => reset()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Submit</span>
                </Button>
              </CredenzaFooter>
            </form>
          </Form>
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
