import HeadingText from "@/components/heading-text";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BarChart, PiggyBank, Settings, Wallet } from "lucide-react";

export default function FeatureCards() {
  return (
    <section className="bg-secondary" id="features">
      <div className="container space-y-8 py-12 text-center lg:py-20">
        <HeadingText subtext="What does Budget Tracker offer?">
          Features
        </HeadingText>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col gap-4 p-8 text-left dark:bg-secondary">
            <Wallet className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-5">
              <CardTitle>Money Tracker</CardTitle>
              <CardDescription>
                Track income and expenses effortlessly. Search and filter
                transactions for a clear financial overview.
              </CardDescription>
            </div>
          </Card>
          <Card className="flex flex-col gap-4 p-8 text-left dark:bg-secondary">
            <PiggyBank className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-5">
              <CardTitle>Budget Planning</CardTitle>
              <CardDescription>
                Set and manage budgets across categories. Stay on track with
                your financial goals.
              </CardDescription>
            </div>
          </Card>
          <Card className="flex flex-col gap-4 p-8 text-left dark:bg-secondary">
            <BarChart className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-5">
              <CardTitle>Insightful Analytics</CardTitle>
              <CardDescription>
                Gain data-driven insights into your finances. Visualize spending
                patterns and balance trends.
              </CardDescription>
            </div>
          </Card>
          <Card className="flex flex-col gap-4 p-8 text-left dark:bg-secondary">
            <Settings className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-5">
              <CardTitle>Personalization</CardTitle>
              <CardDescription>
                Personalize your app settings, currency, and export data. Adapt
                the tracker to your needs.
              </CardDescription>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
