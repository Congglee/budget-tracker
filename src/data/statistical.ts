import { getCategorySummary } from "@/data/category";
import { getHistoryData, getHistoryPeriods } from "@/data/history";
import { getFinancialSummary } from "@/data/transaction";
import { DateRange, HistoryData, TimeFrame } from "@/types";

export async function getDashboardOverview({
  userId,
  dateRange,
  timeFrame,
  period,
}: {
  userId: string;
  dateRange?: DateRange;
  timeFrame: TimeFrame;
  period: Pick<HistoryData, "year" | "month">;
}) {
  const financialSummary = await getFinancialSummary(userId, dateRange);
  const categorySummary = await getCategorySummary(userId, dateRange);
  const historyData = await getHistoryData(userId, timeFrame, period);
  const historyPeriods = await getHistoryPeriods(userId);

  return { financialSummary, categorySummary, historyData, historyPeriods };
}
