"use client";

import { useAppContext } from "@/app/app-context";
import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table/data-table";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import DataTableRowActions from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, exportToCsv, formatCurrency, getCurrencyLabel } from "@/lib/utils";
import {
  Budget,
  Category,
  Transaction,
  TransactionType,
  UserSettings,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface TransactionListProps {
  transactions: Transaction[];
  userSettings: UserSettings;
  categories: Category[];
}

export default function TransactionList({
  transactions,
  userSettings,
  categories,
}: TransactionListProps) {
  const [deleteTransactionAlertOpen, setDeleteTransactionAlertOpen] =
    useState<boolean>(false);
  const [deleteTransactionsAlertOpen, setDeleteTransactionsAlertOpen] =
    useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [transactionIds, setTransactionIds] = useState<string[]>([]);

  const formatUserCurrency = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings]);
  const { setCategoriesOptions } = useAppContext();
  const router = useRouter();
  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);

  const categoryOptions = useMemo(() => {
    return categories.length
      ? categories.map((category) => ({
          label: `${category.icon} ${category.name}`,
          value: category.id,
        }))
      : [];
  }, [categories]);

  useEffect(() => {
    setCategoriesOptions(categoryOptions);
  }, [categoryOptions, setCategoriesOptions]);

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
        setTransaction(null);
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
    if (!transactions.length) {
      toast.info("No data to export.");
      return;
    }
    const currency = userCurrencyLabel.split(" ")[0] || "$";
    const csvData = transactions.length
      ? transactions.map((transaction) => ({
          id: transaction.id,
          name: transaction.name,
          amount: `${currency}${transaction.amount}`,
          description: transaction.description,
          date: format(transaction.date, "dd/MM/yyyy"),
          type: transaction.type,
          category: (transaction as any).category.name,
          budget: transaction.budgetId
            ? (transaction as any).budget.name
            : "No budget",
        }))
      : [];
    exportToCsv(csvData, "transactions");
  }, [transactions, userCurrencyLabel]);

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
          <div className="w-52 line-clamp-3">
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
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as Category;
        return <div className="truncate">{category.name}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as Category).id);
      },
    },
    {
      accessorKey: "budget",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Budget" />
      ),
      cell: ({ row }) => {
        const budget = row.getValue("budget") as Budget;
        return (
          <div className="truncate">{budget ? budget.name : "No budget"}</div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes((row.getValue(id) as Budget).id);
      },
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
            setTransaction(row.original);
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
    <>
      <DataTable
        data={transactions}
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
          handleDeleteTransaction(transaction?.id as string);
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
    </>
  );
}
