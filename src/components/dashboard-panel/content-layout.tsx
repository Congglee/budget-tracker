import DashboardNav from "@/components/dashboard-panel/dashboard-nav";
import { ReactNode } from "react";

interface ContentLayoutProps {
  title: string;
  children: ReactNode;
}

export default function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <main>
      <DashboardNav title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </main>
  );
}
