"use client";

import CurrencyComboBox from "@/app/wizard/_components/currency-combo-box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { userSettingsCreateSchema } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof userSettingsCreateSchema>;

export default function UserSettingsEditForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(userSettingsCreateSchema),
    defaultValues: { currency: "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/users/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await parseApiResponse<string>(response);
      toast.success("Settings saved successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <CurrencyComboBox
                    value={field.value}
                    onSelect={(value) => form.setValue("currency", value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <Separator />
          <CardFooter className="p-5">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              I&apos;m done! Take me to the dashboard
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
