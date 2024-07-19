import Footer from "@/components/footer";
import Header from "@/components/header";
import { ReactNode } from "react";

export default function FrontPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
