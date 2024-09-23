import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding Wizard",
  description: "Set up your account to get started with Budget Tracker",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex py-10 items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
