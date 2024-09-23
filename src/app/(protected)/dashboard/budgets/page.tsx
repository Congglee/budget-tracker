import BudgetList from "@/app/(protected)/dashboard/budgets/_components/budget-list";
import AddBudgetButton from "@/components/budget/add-budget-button";
import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategoriesByUserId } from "@/data/category";
import { getUserSettingsById } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Budgets",
  description: "Manage your budgets.",
};

export default async function BudgetsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const [categories, userSettings] = await Promise.all([
    getCategoriesByUserId(userId),
    getUserSettingsById(userId),
  ]);

  return (
    <ContentLayout title="Budgets">
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
              <Link href="/dashboard/budgets">Budgets</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-6">
        <DashboardHeading
          heading="Budgets"
          description="Manage your budgets."
          wrapperClassName="sm:flex-row"
        >
          <AddBudgetButton
            userSettings={userSettings!}
            categories={categories}
          />
        </DashboardHeading>
        <BudgetList userSettings={userSettings!} categories={categories} />
      </div>
    </ContentLayout>
  );
}
