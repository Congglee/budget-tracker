import omitBy from "lodash/omitBy";
import isUndefined from "lodash/isUndefined";
import { useQueryParams } from "@/hooks/use-query-params";
import { SearchParams } from "@/types";

export type QueryConfig = {
  [key in keyof SearchParams]: string;
};

export function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      from: queryParams.from,
      to: queryParams.to,
      time_frame: queryParams.time_frame,
      month: queryParams.month,
      year: queryParams.year,
    },
    isUndefined
  );
  return queryConfig;
}
