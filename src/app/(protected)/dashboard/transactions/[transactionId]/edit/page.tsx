import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import AddTransactionForm from "@/components/transaction/add-transaction-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategoriesByUserId } from "@/data/category";
import { getTransactionByIdAndUserId } from "@/data/transaction";
import { getUserSettingsById } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface TransactionEditProps {
  params: { transactionId: string };
}

export async function generateMetadata({
  params,
}: TransactionEditProps): Promise<Metadata> {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const transaction = await getTransactionByIdAndUserId(
    params.transactionId,
    userId
  );

  return {
    title: transaction?.name ? `${transaction.name} Settings` : "Not Found",
    description: "Modify transaction details.",
  };
}

export default async function TransactionEdit({
  params,
}: TransactionEditProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const [userSettings, categories, transaction] = await Promise.all([
    getUserSettingsById(userId),
    getCategoriesByUserId(userId),
    getTransactionByIdAndUserId(params.transactionId, userId),
  ]);

  if (!transaction) {
    notFound();
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
              <Link href="/dashboard/transactions">Transactions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/dashboard/transactions/${params.transactionId}/edit`}
              >
                Edit Transaction
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardHeading
        heading="Transaction Settings 📝"
        description="Modify transaction details."
      />
      <AddTransactionForm
        categories={categories}
        userSettings={userSettings!}
        transaction={transaction}
        heading="Transaction Details"
        description="Enter the new details for the transaction."
      />
    </ContentLayout>
  );
}
