"use client";

import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table/data-table";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import DataTableRowActions from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, exportToCsv, formatCurrency, getCurrencyLabel } from "@/lib/utils";
import { ExtendedBudget } from "@/types";
import { Transaction, TransactionType, UserSettings } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface BudgetTransactionListProps {
  budget: ExtendedBudget;
  userSettings: UserSettings;
}

export default function BudgetTransactionList({
  budget,
  userSettings,
}: BudgetTransactionListProps) {
  const [transactionIds, setTransactionIds] = useState<string[]>([]);
  const [deleteTransactionAlertOpen, setDeleteTransactionAlertOpen] =
    useState<boolean>(false);
  const [deleteTransactionsAlertOpen, setDeleteTransactionsAlertOpen] =
    useState<boolean>(false);
  const [budgetTransaction, setBudgetTransaction] =
    useState<Transaction | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const formatUserCurrency = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings]);
  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);
  const router = useRouter();

  const handleDeleteTransaction = async (transactionId: string) => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        setDeleteTransactionAlertOpen(false);
        setBudgetTransaction(null);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteTransactions = async (transactionsIds: string[]) => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/transactions`, {
        method: "DELETE",
        body: JSON.stringify({ list_id: transactionsIds }),
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        setDeleteTransactionsAlertOpen(false);
        setTransactionIds([]);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleExportCSV = useCallback(() => {
    if (!budget.transactions.length) {
      toast.info("No data to export.");
      return;
    }
    const currency = userCurrencyLabel.split(" ")[0] || "$";
    const csvData = budget.transactions.length
      ? budget.transactions.map((transaction) => ({
          id: transaction.id,
          name: transaction.name,
          amount: `${currency}${transaction.amount}`,
          description: transaction.description,
          date: format(transaction.date, "dd/MM/yyyy"),
          type: transaction.type,
          category: budget.category.name,
          budget: budget.name,
        }))
      : [];
    exportToCsv(csvData, "transactions");
  }, [budget.transactions, userCurrencyLabel]);

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            const transactionId = row.original.id;
            if (!row.getIsSelected()) {
              setTransactionIds((prevIds) => [...prevIds, transactionId]);
            } else {
              setTransactionIds((prevIds) =>
                prevIds.filter((id) => id !== transactionId)
              );
            }
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction ID" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="w-28 font-medium line-clamp-2 hover:text-primary hover:underline">
            <Link href={`/dashboard/transactions/${row.original.id}/edit`}>
              {row.getValue("name")}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="w-60 line-clamp-3">
            {row.getValue("description") || "No description"}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {formatUserCurrency.format(row.getValue("amount"))}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return <div>{format(row.getValue("date"), "dd/MM/yyyy")}</div>;
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const isIncomeType = row.getValue("type") === TransactionType.INCOME;
        return (
          <div className="font-medium capitalize">
            <Badge
              className={cn(isIncomeType ? "bg-emerald-500" : "bg-rose-500")}
            >
              {row.getValue("type")}
            </Badge>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        return <div className="truncate">{budget.category.name}</div>;
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Update At" />
      ),
      cell: ({ row }) => {
        return <div>{format(row.getValue("updatedAt"), "dd/MM/yyyy")}</div>;
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          enableDeleting={true}
          enableEditing={true}
          onDelete={() => {
            setBudgetTransaction(row.original);
            setDeleteTransactionAlertOpen(true);
          }}
          onEdit={() => {
            router.push(`/dashboard/transactions/${row.original.id}/edit`);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{budget.name} Expenses</h2>
      </div>
      <DataTable
        data={budget.transactions}
        columns={columns}
        placeholder="Filter transaction..."
        onSelectedRowsIds={setTransactionIds}
        onConfirmOpen={() => setDeleteTransactionsAlertOpen(true)}
        handleExportCSV={handleExportCSV}
        hiddenColumns={["id"]}
      />
      <ConfirmDialog
        open={deleteTransactionAlertOpen}
        onOpenStateChange={setDeleteTransactionAlertOpen}
        title="Are you sure you want to delete this transaction?"
        description="This action cannot be undone."
        onConfirm={() => {
          handleDeleteTransaction(budgetTransaction?.id as string);
        }}
        isSubmitLoading={isDeleteLoading}
      />
      <ConfirmDialog
        open={deleteTransactionsAlertOpen}
        onOpenStateChange={setDeleteTransactionsAlertOpen}
        title="Are you sure you want to delete these transactions?"
        description="This action cannot be undone."
        onConfirm={() => handleDeleteTransactions(transactionIds)}
        isSubmitLoading={isDeleteLoading}
      />
    </div>
  );
}
