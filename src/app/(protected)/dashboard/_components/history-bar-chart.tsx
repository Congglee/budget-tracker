import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "react-countup";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { FileText } from "lucide-react";
import { HistoryData } from "@/types";

interface HistoryBarChartProps {
  historyData: HistoryData[];
  formatUserCurrency: Intl.NumberFormat;
  timeFrame: string;
}

export default function HistoryBarChart({
  historyData,
  formatUserCurrency,
  timeFrame,
}: HistoryBarChartProps) {
  return (
    <>
      {historyData && historyData.length > 0 ? (
        <div className="overflow-auto scroll">
          <div className="min-w-[940px]">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart height={300} data={historyData} barCategoryGap={5}>
                <defs>
                  <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="5 5"
                  strokeOpacity="0.2"
                  vertical={false}
                />
                <XAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 5, right: 5 }}
                  dataKey={(data) => {
                    const { year, month, day } = data;
                    const date = new Date(year, month - 1, day || 1);

                    if (timeFrame === "year") {
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                      });
                    }

                    return date.toLocaleString("en-US", {
                      day: "2-digit",
                    });
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar
                  dataKey="income"
                  label="Income"
                  fill="url(#incomeBar)"
                  radius={4}
                  className="cursor-pointer"
                />
                <Bar
                  dataKey="expense"
                  label="Expense"
                  fill="url(#expenseBar)"
                  radius={4}
                  className="cursor-pointer"
                />
                <Tooltip
                  cursor={{ opacity: 0.1 }}
                  content={(props) => {
                    const { payload, active } = props;
                    if (!active || !payload || !payload.length) return null;
                    const { income, expense } = payload[0].payload;
                    return (
                      <div className="min-w-48 rounded border bg-background p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500" />
                          <div className="flex-1 flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                              Expense
                            </span>
                            <div className="text-sm font-bold text-red-500">
                              <CountUp
                                duration={0.5}
                                preserveValue
                                end={expense}
                                decimals={0}
                                formattingFn={(value) =>
                                  formatUserCurrency.format(value)
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-4 w-4 rounded-full bg-emerald-500" />
                          <div className="flex-1 flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                              Income
                            </span>
                            <div className="text-sm font-bold text-emerald-500">
                              <CountUp
                                duration={0.5}
                                preserveValue
                                end={income}
                                decimals={0}
                                formattingFn={(value) =>
                                  formatUserCurrency.format(value)
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-4 w-4 rounded-full bg-primary" />
                          <div className="flex-1 flex justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                              Balance
                            </span>
                            <div className="text-sm font-bold text-primary">
                              <CountUp
                                duration={0.5}
                                preserveValue
                                end={income - expense}
                                decimals={0}
                                formattingFn={(value) =>
                                  formatUserCurrency.format(value)
                                }
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyPlaceholder className="min-h-[400px]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileText className="w-10 h-10" />
          </div>
          <EmptyPlaceholder.Title>
            No data available for the selected period
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Please try selecting a different period to view data.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  );
}
