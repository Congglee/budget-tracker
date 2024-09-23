import CategoryList from "@/app/(protected)/dashboard/categories/_components/category-list";
import AddCategoryButton from "@/components/category/add-category-button";
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
import { currentUser } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your categories.",
};

export default async function Categories() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as string;

  const categories = await getCategoriesByUserId(userId);

  return (
    <ContentLayout title="Categories">
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
              <Link href="/dashboard/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-6">
        <DashboardHeading
          heading="Categories"
          description="Manage your categories."
          wrapperClassName="sm:flex-row"
        >
          <AddCategoryButton />
        </DashboardHeading>
        <CategoryList categories={categories} />
      </div>
    </ContentLayout>
  );
}
