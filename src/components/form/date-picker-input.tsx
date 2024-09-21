import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  value?: Date;
  onSelect?: (...event: any[]) => void;
  enableFutureTime?: boolean;
}

export default function DatePickerInput({
  className,
  value,
  onSelect,
  enableFutureTime = false,
}: DatePickerProps) {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? format(value, "dd MMMM yyyy") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            selected={value}
            defaultMonth={value}
            onSelect={onSelect}
            disabled={(date) =>
              (!enableFutureTime && date > new Date()) ||
              date < new Date("1900-01-01")
            }
            fromYear={1960}
            toYear={new Date().getFullYear() + 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
