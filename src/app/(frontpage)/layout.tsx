import Header from "@/components/header";
import { ReactNode } from "react";

export default function FrontPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen w-full bg-background">
      <Header />
      {children}
    </div>
  );
}
