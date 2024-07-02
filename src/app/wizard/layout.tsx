import { ReactNode } from "react";

export default function WizardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen">
      {children}
    </div>
  );
}
