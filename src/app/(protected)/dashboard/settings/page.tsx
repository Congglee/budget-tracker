import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettingsForm from "@/components/settings/user-settings-form";
import { getOrCreateUserSettings } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/settings/profile-form";
import ChangePasswordForm from "@/components/settings/change-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account and app settings.",
};

export default async function Settings() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const userSettings = await getOrCreateUserSettings(userId);

  return (
    <ContentLayout title="Settings">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-5">
        <DashboardHeading
          heading="Settings"
          description="Manage account and app settings."
        />
        <Tabs defaultValue="account">
          <TabsList className="sm:grid sm:grid-cols-3 sm:w-full">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password" disabled={user.isOAuth}>
              Password
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-5">
            <ProfileForm user={user} />
          </TabsContent>
          <TabsContent value="settings" className="mt-5">
            <UserSettingsForm
              userSettings={userSettings}
              btnClassName="md:w-auto"
            />
          </TabsContent>
          <TabsContent value="password" className="mt-5">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
