import DashboardPanelLayout from "@/components/dashboard-panel/dashoard-panel-layout";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardPanelLayout>{children}</DashboardPanelLayout>;
}
