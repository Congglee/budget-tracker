import { ReactNode } from "react";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex py-10 items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
