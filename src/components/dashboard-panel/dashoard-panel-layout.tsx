"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Sidebar from "@/components/dashboard-panel/sidebar";
import DashboardFooter from "@/components/dashboard-panel/dashboard-footer";
import { useStore } from "@/hooks/use-store";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <DashboardFooter />
      </footer>
    </>
  );
}
