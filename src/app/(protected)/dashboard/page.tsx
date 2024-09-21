import DashboardOverview from "@/app/(protected)/dashboard/_components/dashboard-overview";
import HistorySection from "@/app/(protected)/dashboard/_components/history-section";
import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import DateRangePicker from "@/components/date-range-picker";
import AddTransactionButton from "@/components/transaction/add-transaction-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategoriesByUserId } from "@/data/category";
import { getDashboardOverview } from "@/data/statistical";
import { getUserSettingsById } from "@/data/user-settings";
import { currentUser } from "@/lib/session";
import { parseDateRangeParams, parseTimeFrameParams } from "@/lib/utils";
import { ExtendedCategory, SearchParams } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  searchParams: SearchParams;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const dateRange = parseDateRangeParams(searchParams);
  const { timeFrame, year, month } = parseTimeFrameParams(searchParams);

  const [categories, userSettings, overviewData] = await Promise.all([
    getCategoriesByUserId(userId),
    getUserSettingsById(userId),
    getDashboardOverview({
      dateRange,
      timeFrame,
      period: { year, month },
      userId,
    }),
  ]);

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
      <DashboardHeading heading={`Welcome back, ${user.name} 👋`}>
        <DateRangePicker />
        <AddTransactionButton
          categories={categories as ExtendedCategory[]}
          userSettings={userSettings!}
          btnClassName="h-9"
        />
      </DashboardHeading>
      <div className="space-y-6 mt-6">
        <DashboardOverview data={overviewData} userSettings={userSettings!} />
        <HistorySection
          data={overviewData}
          userSettings={userSettings!}
          historyPeriods={overviewData.historyPeriods}
        />
      </div>
    </ContentLayout>
  );
}
