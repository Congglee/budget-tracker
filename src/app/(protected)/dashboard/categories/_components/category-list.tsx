"use client";

import AddCategoryForm from "@/components/category/add-category-form";
import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table/data-table";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import DataTableRowActions from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, exportToCsv } from "@/lib/utils";
import { Category, TransactionType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [updateCategoryDrawerOpen, setUpdateCategoryDrawerOpen] =
    useState<boolean>(false);
  const [deleteCategoryAlertOpen, setDeleteCategoryAlertOpen] =
    useState<boolean>(false);
  const [deleteCategoriesAlertOpen, setDeleteCategoriesAlertOpen] =
    useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const router = useRouter();

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        setDeleteCategoryAlertOpen(false);
        setCategory(null);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteCategories = async (categoriesIds: string[]) => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/categories`, {
        method: "DELETE",
        body: JSON.stringify({ list_id: categoriesIds }),
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        setDeleteCategoriesAlertOpen(false);
        setCategoryIds([]);
        router.refresh();
      }
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleExportCSV = useCallback(() => {
    if (!categories.length) {
      toast.info("No data to export.");
      return;
    }
    const csvData = categories.length
      ? categories.map((category) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          type: category.type,
        }))
      : [];
    exportToCsv(csvData, "categories");
  }, [categories]);

  const columns: ColumnDef<Category>[] = [
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
            const categoryId = row.original.id;
            if (!row.getIsSelected()) {
              setCategoryIds((prevIds) => [...prevIds, categoryId]);
            } else {
              setCategoryIds((prevIds) =>
                prevIds.filter((id) => id !== categoryId)
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
        <DataTableColumnHeader column={column} title="Category ID" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium line-clamp-2">{row.getValue("name")}</div>
        );
      },
    },
    {
      accessorKey: "icon",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Icon" />
      ),
      cell: ({ row }) => {
        return <div className="text-2xl">{row.getValue("icon")}</div>;
      },
      enableSorting: false,
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
            setCategory(row.original);
            setDeleteCategoryAlertOpen(true);
          }}
          onEdit={() => {
            setCategory(row.original);
            setUpdateCategoryDrawerOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={categories}
        columns={columns}
        placeholder="Filter category..."
        onSelectedRowsIds={setCategoryIds}
        onConfirmOpen={() => setDeleteCategoriesAlertOpen(true)}
        handleExportCSV={handleExportCSV}
      />
      <AddCategoryForm
        open={updateCategoryDrawerOpen}
        onOpenChange={setUpdateCategoryDrawerOpen}
        onAfterUpdate={setCategory}
        heading="Edit"
        category={category}
      />
      <ConfirmDialog
        open={deleteCategoryAlertOpen}
        onOpenStateChange={setDeleteCategoryAlertOpen}
        title="Are you sure you want to delete this category?"
        description="This action cannot be undone."
        onConfirm={() => {
          handleDeleteCategory(category?.id as string);
        }}
        isSubmitLoading={isDeleteLoading}
      />
      <ConfirmDialog
        open={deleteCategoriesAlertOpen}
        onOpenStateChange={setDeleteCategoriesAlertOpen}
        title="Are you sure you want to delete these categories?"
        description="This action cannot be undone."
        onConfirm={() => handleDeleteCategories(categoryIds)}
        isSubmitLoading={isDeleteLoading}
      />
    </>
  );
}
