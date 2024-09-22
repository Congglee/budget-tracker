"use client";

import { updateProfile } from "@/actions/update-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ENTITY_ERROR_STATUS,
  EntityError,
  handleErrorResponse,
} from "@/lib/helper";
import { UploadButton } from "@/lib/uploadthing";
import { UpdateProfileSchema } from "@/schemas";
import { ExtendedUser } from "@/types/next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleUserRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  user: ExtendedUser;
}

type FormData = z.infer<typeof UpdateProfileSchema>;

export default function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
      isTwoFactorEnabled: undefined,
      image: undefined,
    },
  });
  const { handleSubmit, setValue, setError, reset, watch } = form;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useSession();
  const avatar = watch("image");

  useEffect(() => {
    if (user) {
      setValue("name", user.name || undefined);
      setValue("email", user.email || undefined);
      setValue("isTwoFactorEnabled", user.isTwoFactorEnabled || undefined);
      setValue("image", user.image || undefined);
    }
  }, [user, setValue]);

  const onSubmit = handleSubmit((values) => {
    const payloadData = {
      ...values,
      name: values.name || undefined,
      email: values.email || undefined,
      image: values.image || undefined,
    };

    startTransition(() => {
      updateProfile(payloadData).then((data) => {
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
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Enter your profile to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5">
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
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-col xs:flex-row xs:items-center justify-between rounded-lg shadow-sm border p-3 gap-3">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={user.isOAuth}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <UploadButton
                        className="!items-start ut-button:bg-background ut-button:border ut-button:border-input ut-button:hover:bg-accent ut-button:hover:text-accent-foreground"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].url);
                          toast.success("Your avatar image has been uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(
                            "Please choose a valid image file with a maximum size of 4MB",
                            { description: error.message }
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-1 w-24 h-24 rounded-full overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={avatar || ""} alt="User profile picture" />
                  <AvatarFallback>
                    <CircleUserRound className="w-14 h-14 object-cover" />
                  </AvatarFallback>
                </Avatar>
              </div>
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
              onClick={() =>
                reset({
                  name: user.name || undefined,
                  email: user.email || undefined,
                  isTwoFactorEnabled: user.isTwoFactorEnabled || undefined,
                  image: user.image || undefined,
                })
              }
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
