"use client";

import CardWrapper from "@/components/auth/card-wrapper";
import { RegisterSchema } from "@/schemas";
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
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { register } from "@/actions/register";

type FormData = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { handleSubmit, setError } = form;
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((values) => {
    startTransition(() => {
      register(values).then((data) => {
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
          toast.success(data.message, {
            description: "Please check your email to verify your account",
            position: "top-right",
          });
        }
      });
    });
  });

  return (
    <CardWrapper
      heading="Sign Up"
      description="Create an account to get started"
      backBtnLabel="Already have an account?"
      backBtnHref="/auth/login"
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
