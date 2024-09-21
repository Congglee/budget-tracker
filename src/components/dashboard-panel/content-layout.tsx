import DashboardNav from "@/components/dashboard-panel/dashboard-nav";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <>
      <DashboardNav title={title} />
      <div className="container pt-8 pb-10 px-4 sm:px-8">{children}</div>
    </>
  );
}
