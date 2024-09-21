"use client";

import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buildQueryString, cn, parseDateRangeParams } from "@/lib/utils";
import omit from "lodash/omit";
import { CalendarIcon, Check, CircleX } from "lucide-react";
import { useState } from "react";
import { useQueryConfig } from "@/hooks/use-query-config";

export default function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const queryConfig = useQueryConfig();

  const from = queryConfig.from;
  const to = queryConfig.to;

  const dateRange = from && to ? parseDateRangeParams({ from, to }) : undefined;
  const [date, setDate] = useState<DateRange | undefined>(dateRange);

  const handleDateRangeChange = (date?: DateRange) => {
    if (!date || date === undefined) {
      router.push(
        `${pathname}?${buildQueryString(omit(queryConfig, ["from", "to"]))}`
      );
      return null;
    }

    if (date.to === undefined || date.from === undefined) {
      router.push(
        `${pathname}?${buildQueryString(omit(queryConfig, ["from", "to"]))}`
      );
      return null;
    }

    router.push(
      `${pathname}?${buildQueryString({
        ...queryConfig,
        from: date.from?.toISOString(),
        to: date.to?.toISOString(),
      })}`
    );
  };

  return (
    <div className={cn("flex gap-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[16.25rem] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            captionLayout="dropdown-buttons"
            defaultMonth={date?.from}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            fromYear={1960}
            toYear={new Date().getFullYear() + 1}
          />
          <div className="grid grid-cols-1 gap-2 px-2 pb-2 md:grid-cols-2">
            <PopoverClose
              onClick={() => handleDateRangeChange(date)}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm Filter
            </PopoverClose>
            <PopoverClose
              onClick={() => {
                setDate(undefined);
                router.push(
                  `${pathname}?${buildQueryString(
                    omit(queryConfig, ["from", "to"])
                  )}`
                );
              }}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <CircleX className="mr-2 h-4 w-4" />
              Clear Filter
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
