"use client";

import HistoryBarChart from "@/app/(protected)/dashboard/_components/history-bar-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthOptions } from "@/config/options";
import { useQueryConfig } from "@/hooks/use-query-config";
import { buildQueryString, formatCurrency } from "@/lib/utils";
import { HistoryData } from "@/types";
import { UserSettings } from "@prisma/client";
import omit from "lodash/omit";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface HistorySectionProps {
  data: { historyData: HistoryData[] };
  userSettings: UserSettings;
  historyPeriods: number[];
}

export default function HistorySection({
  data,
  userSettings,
  historyPeriods,
}: HistorySectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryConfig = useQueryConfig();

  const formatUserCurrency = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings]);

  const yearOptions = useMemo(() => {
    return historyPeriods.map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));
  }, [historyPeriods]);

  const timeFrameValue = queryConfig.time_frame
    ? queryConfig.time_frame
    : "year";
  const [timeFrame, setTimeFrame] = useState(timeFrameValue);

  const monthValue = queryConfig.month
    ? queryConfig.month
    : (new Date().getMonth() + 1).toString();
  const [month, setMonth] = useState(monthValue);

  const yearValue =
    queryConfig.year ||
    historyPeriods[historyPeriods.length - 1].toString() ||
    new Date().getFullYear().toString();
  const [year, setYear] = useState(yearValue);

  const handleTimeFrameChange = (timeFrame: string) => {
    router.push(
      `${pathname}?${buildQueryString(
        omit(
          {
            ...queryConfig,
            time_frame: timeFrame,
          },
          ["month"]
        )
      )}`,
      { scroll: false }
    );
  };

  const handleMonthChange = (month: string) => {
    router.push(
      `${pathname}?${buildQueryString({
        ...queryConfig,
        month,
      })}`,
      { scroll: false }
    );
  };

  const handleYearChange = (year: string) => {
    router.push(`${pathname}?${buildQueryString({ ...queryConfig, year })}`, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">History</h2>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={timeFrameValue}
                onValueChange={(value) => {
                  handleTimeFrameChange(value);
                  setTimeFrame(value);
                }}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Select a time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={yearValue}
                onValueChange={(value) => {
                  handleYearChange(value);
                  setYear(value);
                }}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timeFrame === "month" && (
                <Select
                  value={monthValue}
                  onValueChange={(value) => {
                    handleMonthChange(value);
                    setMonth(value);
                  }}
                >
                  <SelectTrigger className="min-w-32">
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-x-3 text-right">
              <Badge variant="outline" className="space-x-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-emerald-500" />
                <span>Income</span>
              </Badge>
              <Badge variant="outline" className="space-x-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-red-500" />
                <span>Expense</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HistoryBarChart
            historyData={data.historyData}
            formatUserCurrency={formatUserCurrency}
            timeFrame={timeFrame}
          />
        </CardContent>
      </Card>
    </div>
  );
}
