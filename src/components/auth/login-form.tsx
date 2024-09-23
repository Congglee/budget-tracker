"use client";

import CardWrapper from "@/components/auth/card-wrapper";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ENTITY_ERROR_STATUS,
  EntityError,
  handleErrorResponse,
} from "@/lib/helper";
import { LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import FormError from "@/components/form-error";

type FormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "johndoe@imail.edu.vn",
      password: "123123",
    },
  });
  const { handleSubmit, setError, watch } = form;

  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const onSubmit = handleSubmit((values) => {
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
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
          if (data?.data?.twoFactor) {
            setShowTwoFactor(true);
          }
          if (data?.message) {
            toast.success(data.message, { position: "top-right" });
          }
        }
      });
    });
  });

  return (
    <CardWrapper
      heading="Login"
      description="Welcome back! Sign in to your account to continue"
      backBtnLabel="Don't have an account? Sign up"
      backBtnHref="/auth/register"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="/auth/reset"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="******"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {urlError && <FormError message={urlError} />}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            {showTwoFactor ? (watch("code") ? "Submit" : "Resend") : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
