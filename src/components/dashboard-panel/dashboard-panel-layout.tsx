"use client";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/dashboard-panel/sidebar";
import { useAppContext } from "@/app/app-context";
import DashboardFooter from "@/components/dashboard-panel/dashboard-footer";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAppContext();

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebarOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebarOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <DashboardFooter />
      </footer>
    </>
  );
}
