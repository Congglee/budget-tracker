import ContentLayout from "@/components/dashboard-panel/content-layout";
import { currentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import DateRangePicker from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { parseDateRangeParams } from "@/lib/utils";
import { SearchParams } from "@/types";
import { getTransactionsByUserId } from "@/data/transaction";
import { getUserSettingsById } from "@/data/user-settings";
import { getCategoriesByUserId } from "@/data/category";
import TransactionList from "@/app/(protected)/dashboard/transactions/_components/transaction-list";

interface TransactionsProps {
  searchParams: SearchParams;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const dateRange = parseDateRangeParams(searchParams);

  const [transactions, categories, userSettings] = await Promise.all([
    getTransactionsByUserId(userId, dateRange),
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
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-6">
        <DashboardHeading
          heading="Transactions"
          description="Manage your transactions."
          wrapperClassName="sm:flex-row"
        >
          <DateRangePicker />
          <Button
            variant="outline"
            className="border-primary/50 hover:bg-primary/70 bg-primary text-primary-foreground"
            asChild
          >
            <Link href="/dashboard/transactions/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New transaction
            </Link>
          </Button>
        </DashboardHeading>
        <TransactionList
          transactions={transactions}
          userSettings={userSettings!}
          categories={categories}
        />
      </div>
    </ContentLayout>
  );
}
