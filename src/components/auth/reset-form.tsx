"use client";

import { reset } from "@/actions/reset";
import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
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
  ENTITY_ERROR_STATUS,
  EntityError,
  handleErrorResponse,
} from "@/lib/helper";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof ResetSchema>;

export default function ResetForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });
  const { handleSubmit, setError } = form;

  const onSubmit = handleSubmit((values) => {
    startTransition(() => {
      reset(values).then((data) => {
        if (data?.error) {
          if (data.error.status === ENTITY_ERROR_STATUS) {
            const entityError = new EntityError(data.error as EntityError);
            handleErrorResponse({ error: entityError, setError });
          } else {
            handleErrorResponse({
              error: data.error,
              setError,
              position: "top-right",
            });
          }
        } else {
          toast.success(data.message, { position: "top-right" });
        }
      });
    });
  });

  return (
    <CardWrapper
      heading="Forgot your password?"
      backBtnLabel="Back to login"
      backBtnHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
