import HistorySection from "@/app/dashboard/_components/history-section";
import Overview from "@/app/dashboard/_components/overview";
import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import DateRangePicker from "@/components/date-range-picker";
import AddTransactionBtn from "@/components/transaction/add-transaction-btn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUserCategories } from "@/lib/api/categories";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { getUserSettings } from "@/lib/api/settings";
import { getCurrentUser } from "@/lib/session";
import { parseDateRangeParams, parseTimeFrameParams } from "@/lib/utils";
import { SearchParams } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DashboardProps {
  searchParams: SearchParams;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { user, isLoggedIn } = await getCurrentUser();

  if (!isLoggedIn || !user) {
    redirect("/api/auth/login");
  }

  const userSettings = await getUserSettings(user.id);
  const categories = await getUserCategories(user.id);

  const dateRange = parseDateRangeParams(searchParams);

  const { timeFrame, year, month } = parseTimeFrameParams(searchParams);
  const period = { month, year };

  const overviewData = await getDashboardOverview(
    user.id,
    dateRange,
    timeFrame,
    period
  );

  return (
    <ContentLayout title="Dashboard">
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
        </BreadcrumbList>
      </Breadcrumb>
      <DashboardHeading
        heading={`Welcome back, ${user.given_name} ${user.family_name} 👋`}
      >
        <DateRangePicker />
        <AddTransactionBtn
          categories={categories}
          userSettings={userSettings!}
          btnClassName="h-9"
        />
      </DashboardHeading>
      <Overview data={overviewData} userSettings={userSettings!} />
      <HistorySection
        data={overviewData}
        userSettings={userSettings!}
        historyPeriods={overviewData.historyPeriods}
      />
    </ContentLayout>
  );
}
