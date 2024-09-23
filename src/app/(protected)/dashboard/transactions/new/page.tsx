import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ContentLayout from "@/components/dashboard-panel/content-layout";
import Link from "next/link";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import { getCategoriesByUserId } from "@/data/category";
import { getUserSettingsById } from "@/data/user-settings";
import AddTransactionForm from "@/components/transaction/add-transaction-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Transaction",
  description: "Create a new transaction to track your expenses and income.",
};

// Actually, the AddTransactionBtn component can be reused, but I want to experiment a little with the NextJs app route. 😙
export default async function AddTransactionPage() {
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
    <ContentLayout title="Transactions">
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
              <Link href="/dashboard/transactions">Transactions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/transactions/new">New Transaction</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardHeading
        heading="New Transaction 💱"
        description="Create a new transaction to track your expenses and income."
      />
      <AddTransactionForm
        categories={categories}
        userSettings={userSettings!}
      />
    </ContentLayout>
  );
}
