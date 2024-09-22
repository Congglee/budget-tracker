"use client";

import { useAppContext } from "@/app/app-context";
import DataTableFacetedFilter from "@/components/data-table/data-table-faceted-filter";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { transactionTypesOptions } from "@/config/options";
import { Table } from "@tanstack/react-table";
import { Download, Trash2, X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  hasRowsSelected?: boolean;
  onConfirmOpen?: () => void;
  handleExportCSV?: () => void;
}

export default function DataTableToolbar<TData>({
  table,
  placeholder,
  hasRowsSelected,
  onConfirmOpen,
  handleExportCSV,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { categoriesOptions } = useAppContext();

  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-6">
      <div className="flex flex-wrap flex-col w-full sm:flex-row sm:flex-1 sm:items-center gap-2">
        <Input
          placeholder={placeholder || "Search..."}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && table.getColumn("type")?.getCanFilter() && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={transactionTypesOptions}
          />
        )}
        {table.getColumn("category") &&
          table.getColumn("category")?.getCanFilter() && (
            <DataTableFacetedFilter
              column={table.getColumn("category")}
              title="Category"
              options={categoriesOptions}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-start gap-2">
        {hasRowsSelected && (
          <Button
            variant="destructive"
            size="sm"
            className="h-8 lg:flex"
            onClick={() => {
              onConfirmOpen && onConfirmOpen();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 lg:flex"
          onClick={() => {
            handleExportCSV && handleExportCSV();
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
