"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { FoldHorizontal, Pencil, Trash2 } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  enableDeleting?: boolean;
  enableEditing?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function DataTableRowActions<TData>({
  row,
  enableDeleting,
  enableEditing,
  onDelete,
  onEdit,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <FoldHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          disabled={!enableEditing}
          onClick={() => onEdit && onEdit()}
          className="cursor-pointer"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!enableDeleting}
          className="cursor-pointer"
          onClick={() => onDelete && onDelete()}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
