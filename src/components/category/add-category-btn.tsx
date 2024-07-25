import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusSquare } from "lucide-react";

interface AddCategoryBtnProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCategoryBtn({
  className,
  open,
  onOpenChange,
}: AddCategoryBtnProps) {
  return (
    <Button
      variant="ghost"
      className={cn("w-full", className)}
      onClick={() => onOpenChange(!open)}
    >
      <PlusSquare className="mr-2 h-4 w-4" />
      Create new
    </Button>
  );
}
