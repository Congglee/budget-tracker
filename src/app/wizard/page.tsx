import UserSettingsForm from "@/app/wizard/_components/user-settings-form";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { getUserSettings } from "@/lib/api/settings";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Wizard() {
  const { user, isLoggedIn } = await getCurrentUser();

  if (!isLoggedIn || !user) {
    redirect("/api/auth/login");
  }

  const userSettings = await getUserSettings(user.id);

  if (userSettings) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-2xl flex flex-col items-center justify-between gap-4">
      <div className="space-y-4">
        <h1 className="text-center text-3xl space-x-2">
          Welcome,{" "}
          <span className="font-bold">
            {user.given_name} {user.family_name} 👋🥳
          </span>
        </h1>
        <p className="mt-4 text-center text-muted-foreground leading-8">
          Let&apos;s get started by setting up your currency.
          <br />
          <span className="text-sm">
            You can change these settings at any time
          </span>{" "}
        </p>
      </div>
      <Separator />
      <UserSettingsForm />
      <Logo wrapperClassName="mt-8" />
    </div>
  );
}
