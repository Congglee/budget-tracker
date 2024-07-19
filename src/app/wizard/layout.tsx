import { ReactNode } from "react";

export default function WizardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex py-10 items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
