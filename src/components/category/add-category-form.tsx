"use client";

import ComboboxInput from "@/components/form/combobox-input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { transactionTypesOptions } from "@/config/options";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { AddCategorySchema } from "@/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, TransactionType } from "@prisma/client";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { CircleOff, LoaderCircle, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddCategoryFormProps {
  open: boolean;
  type?: TransactionType;
  heading?: string;
  category?: Category | null;

  onOpenChange: (open: boolean) => void;
  onAfterUpdate?: (category: Category | null) => void;
}

type FormData = z.infer<typeof AddCategorySchema>;

export default function AddCategoryForm({
  open,
  onOpenChange,
  type,
  category,
  heading,
  onAfterUpdate,
}: AddCategoryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      type: TransactionType.INCOME,
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
    setValue,
  } = form;
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (type) {
      setValue("type", type);
    }
  }, [setValue, type]);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("icon", category.icon);
      setValue("type", category.type as TransactionType);
    }
  }, [setValue, category]);

  useEffect(() => {
    if (!open && !category) {
      reset({
        name: "",
        icon: "",
        type: type ? type : TransactionType.INCOME,
      });
    }
  }, [category, open, reset, type]);

  const addCategory = async (values: FormData) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<Category>(response);
      if (response.ok) {
        toast.success(result.message);
        onOpenChange(!open);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error, setError, position: "top-center" });
    }
  };

  const updateCategory = async (values: FormData) => {
    try {
      const response = await fetch(`/api/categories/${category?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<Category>(response);
      if (response.ok) {
        toast.success(result.message);
        onOpenChange(!open);
        onAfterUpdate && onAfterUpdate(null);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error, setError, position: "top-center" });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (category) {
      await updateCategory(values);
    } else {
      await addCategory(values);
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto scroll h-full text-foreground">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <SheetHeader>
              <SheetTitle>
                {heading || "Create a new"}{" "}
                <span className="text-primary">category</span>
              </SheetTitle>
              <SheetDescription>
                Categories are used to group your transactions.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Category name..."
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
                      onSelect={(value) =>
                        setValue("type", value as TransactionType)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="icon">Icon</FormLabel>
                    <div className="space-y-4">
                      <div
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full h-20"
                        )}
                      >
                        <span className="text-5xl">
                          {field.value ? (
                            field.value
                          ) : (
                            <CircleOff className="h-[48px] w-[48px]" />
                          )}
                        </span>
                      </div>
                      <FormControl>
                        <EmojiPicker
                          theme={theme.resolvedTheme as Theme}
                          onEmojiClick={(emoji) => field.onChange(emoji.emoji)}
                          style={{ width: "100%", height: "400px" }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="mt-8 sm:space-x-4 gap-y-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() =>
                  reset({
                    name: category?.name || "",
                    icon: category?.icon || "",
                    type:
                      (category?.type as TransactionType) ||
                      TransactionType.INCOME,
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
