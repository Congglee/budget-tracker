import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import UserSettingsForm from "@/components/user-settings/user-settings-form";
import { getUserSettingsById } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userSettings = await getUserSettingsById(user.id as string);

  if (userSettings) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-2xl flex flex-col items-center justify-between gap-4">
      <div className="space-y-4">
        <h1 className="text-center text-3xl space-x-2">
          Welcome, <span className="font-bold">{user.name} 👋🥳</span>
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
      <UserSettingsForm
        heading="Currency"
        description="Set your default currency for the app"
        confirmButtonText="I'm done! Take me to the dashboard"
        isInWizardStep={true}
      />
      <Logo wrapperClassName="mt-8" />
    </div>
  );
}
