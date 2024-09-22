"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencies } from "@/config/options";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CurrencyComboBoxProps {
  value?: string;
  onSelect?: (value: string) => void;
}

export default function CurrencyComboBox({
  value,
  onSelect,
}: CurrencyComboBoxProps) {
  const [open, setOpen] = useState<boolean>(false);
  const isTablet = useMediaQuery("(min-width: 768px)");

  if (isTablet) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? currencies.find((currency) => currency.value === value)?.label
              : "Set currency"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0"
          align="start"
        >
          <OptionList setOpen={setOpen} onSelect={onSelect} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value
            ? currencies.find((currency) => currency.value === value)?.label
            : "Set currency"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} onSelect={onSelect} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList({
  setOpen,
  onSelect,
}: {
  setOpen: (open: boolean) => void;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter curreny..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={() => {
                onSelect && onSelect(currency.value);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
