import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { CircleAlert } from "lucide-react";
import ContentLayout from "@/components/dashboard-panel/content-layout";

export default function NotFound() {
  return (
    <ContentLayout title="Budget">
      <div className="flex items-center justify-center md:p-4 lg:p-8">
        <EmptyPlaceholder className="mx-auto max-w-[800px] border-primary">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CircleAlert className="h-10 w-10" />
          </div>
          <EmptyPlaceholder.Title>Not Found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            This budget cound not be found. Please try again.
          </EmptyPlaceholder.Description>
          <Link
            href="/dashboard/budgets"
            className={buttonVariants({ variant: "outline" })}
          >
            Go to Budgets Dashboard
          </Link>
        </EmptyPlaceholder>
      </div>
    </ContentLayout>
  );
}
