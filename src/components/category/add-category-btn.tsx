"use client";

import AddCategoryForm from "@/components/category/add-category-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface AddCategoryBtnProps {
  btnClassName?: string;
}

export default function AddCategoryBtn({ btnClassName }: AddCategoryBtnProps) {
  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] =
    useState<boolean>(false);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "border-primary/50 hover:bg-primary/70 bg-primary text-primary-foreground",
          btnClassName
        )}
        onClick={() => setAddCategoryDrawerOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New category
      </Button>
      <AddCategoryForm
        open={addCategoryDrawerOpen}
        onOpenChange={setAddCategoryDrawerOpen}
      />
    </>
  );
}
