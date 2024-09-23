import BudgetCard from "@/app/(protected)/dashboard/budgets/_components/budget-card";
import BudgetTransactionList from "@/app/(protected)/dashboard/budgets/_components/budget-transaction-list";
import BudgetForm from "@/components/budget/budget-form";
import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBudgetByIdAndUserId } from "@/data/budget";
import { getCategoriesByUserId } from "@/data/category";
import { getUserSettingsById } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface BudgetEditProps {
  params: { budgetId: string };
}

export async function generateMetadata({
  params,
}: BudgetEditProps): Promise<Metadata> {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const budget = await getBudgetByIdAndUserId(params.budgetId, userId);

  return {
    title: budget?.name ? `${budget.name} Settings` : "Not Found",
    description: "Modify budget details.",
  };
}

export default async function BudgetEdit({ params }: BudgetEditProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const [budget, userSettings, categories] = await Promise.all([
    getBudgetByIdAndUserId(params.budgetId, userId),
    getUserSettingsById(userId),
    getCategoriesByUserId(userId),
  ]);

  if (!budget) {
    return notFound();
  }

  return (
    <ContentLayout title="Transaction">
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/budgets/${budget.id}/edit`}>
                Edit Budget
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-8">
        <DashboardHeading
          heading="Budget Settings 📝"
          description="Modify budget details."
        />
        <div className="grid flex-1 items-start gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4">
            <BudgetForm
              budget={budget}
              userSettings={userSettings!}
              categories={categories}
            />
          </div>
          <div>
            <BudgetCard
              budget={budget}
              userSettings={userSettings!}
              isEdit={true}
            />
          </div>
        </div>
        <BudgetTransactionList budget={budget} userSettings={userSettings!} />
      </div>
    </ContentLayout>
  );
}
