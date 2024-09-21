"use client";

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
import CurrencyComboBox from "@/components/user-settings/currency-combo-box";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { AddUserSettingsSchema } from "@/schemas/user-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSettings } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProfileFormProps {
  btnClassName?: string;
  confirmButtonText?: string;
  heading?: string;
  description?: string;
  userSettings?: UserSettings;
  isInWizardStep?: boolean;
}

type FormData = z.infer<typeof AddUserSettingsSchema>;

export default function UserSettingsForm({
  btnClassName,
  confirmButtonText,
  heading,
  description,
  userSettings,
  isInWizardStep,
}: ProfileFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddUserSettingsSchema),
    defaultValues: { currency: "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    setValue,
  } = form;
  const router = useRouter();

  useEffect(() => {
    if (userSettings) {
      setValue("currency", userSettings.currency);
    }
  }, [userSettings, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/users/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<UserSettings>(response);
      toast.success(result.message);
      isInWizardStep ? router.push("/dashboard") : router.refresh();
    } catch (error) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>{heading || "Your Settings"}</CardTitle>
            <CardDescription>
              {description || "Set your default currency for the app."}
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
                    onSelect={(value) => setValue("currency", value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <Separator />
          <CardFooter className="p-5">
            <Button
              type="submit"
              className={cn("w-full overflow-hidden", btnClassName)}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {confirmButtonText || "Update settings"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
