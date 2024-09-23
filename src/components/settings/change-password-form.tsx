"use client";

import { updateProfile } from "@/actions/update-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { UpdateProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof UpdateProfileSchema>;

export default function ChangePasswordForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { password: undefined, newPassword: undefined },
  });
  const { handleSubmit, setError, reset } = form;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useSession();

  const onSubmit = handleSubmit((values) => {
    startTransition(() => {
      updateProfile(values).then((data) => {
        if (data?.error) {
          if (data.error.status === ENTITY_ERROR_STATUS) {
            const entityError = new EntityError(data.error as EntityError);
            handleErrorResponse({ error: entityError, setError });
          } else {
            handleErrorResponse({ error: data.error, setError });
          }
        } else {
          update();
          toast.success(data.message);
          router.refresh();
        }
      });
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Change Your Password</CardTitle>
            <CardDescription>
              Enter your current password and a new password to change your
              account password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start md:items-center md:flex-row gap-4">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isPending}
            >
              {isPending && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full md:w-auto"
              disabled={isPending}
              onClick={() => reset()}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
