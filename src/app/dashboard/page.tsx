import ContentLayout from "@/components/dashboard-panel/content-layout";
import DashboardHeading from "@/components/dashboard-panel/dashboard-heading";
import AddTransactionBtn from "@/components/transaction/add-transaction-btn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategoriesByType } from "@/lib/api/categories";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user, isLoggedIn } = await getCurrentUser();

  if (!isLoggedIn || !user) {
    redirect("/api/auth/login");
  }

  const categories = await getCategoriesByType(user.id);

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
        heading={`Welcome back, ${user.given_name} ${user.family_name}! 👋`}
      >
        <AddTransactionBtn categories={categories} />
      </DashboardHeading>
    </ContentLayout>
  );
}
