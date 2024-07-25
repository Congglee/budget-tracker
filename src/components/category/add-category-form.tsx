"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { categoryCreateSchema } from "@/lib/validations/category";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@/types";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { DefaultResponse } from "@/types/utils";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import Combobox from "@/components/combobox";
import { transactionTypesOptions } from "@/config/options";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { CircleOff, LoaderCircle, Plus } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface AddCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TransactionType;
}

type FormData = z.infer<typeof categoryCreateSchema>;

export default function AddCategoryForm({
  open,
  onOpenChange,
  type,
}: AddCategoryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      icon: "",
      type,
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
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await parseApiResponse<DefaultResponse<Category>>(response);
      if (response.ok) {
        toast.success("Category created successfully");
        onOpenChange(!open);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto scroll h-full text-foreground">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <SheetHeader>
              <SheetTitle>
                Add new <span className="text-primary">category</span>
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
              <Button type="button" variant="outline" onClick={() => reset()}>
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
