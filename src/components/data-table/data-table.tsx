"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { useEffect, useState } from "react";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder?: string;
  onSelectedRowsIds?: (selectedRowsIds: string[]) => void;
  onConfirmOpen?: () => void;
  handleExportCSV?: () => void;
  hiddenColumns?: string[];
}

export default function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  placeholder,
  onSelectedRowsIds,
  onConfirmOpen,
  handleExportCSV,
  hiddenColumns,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const hideColunms = (keys: string[]): { [key: string]: boolean } => {
    return keys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as { [key: string]: boolean });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const selectedRowModel = table.getSelectedRowModel().rows;
    const selectedRowIds = selectedRowModel.map((row) => row.id);
    onSelectedRowsIds && onSelectedRowsIds(selectedRowIds || []);
  }, [table.getIsAllPageRowsSelected()]);

  useEffect(() => {
    hiddenColumns && table.setColumnVisibility(hideColunms(hiddenColumns));
  }, [hiddenColumns, table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        placeholder={placeholder}
        hasRowsSelected={table.getSelectedRowModel().rows.length > 0}
        onConfirmOpen={onConfirmOpen}
        handleExportCSV={handleExportCSV}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
