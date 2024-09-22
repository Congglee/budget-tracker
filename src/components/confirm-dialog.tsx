import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { LoaderCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: (...args: any[]) => unknown;
  isSubmitLoading: boolean;
}

export default function ConfirmDialog({
  open,
  onOpenStateChange,
  title,
  onConfirm,
  cancelText,
  confirmText,
  description,
  isSubmitLoading,
}: ConfirmDialogProps) {
  return (
    <Credenza open={open} onOpenChange={onOpenStateChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter className="flex flex-col-reverse">
          <CredenzaClose asChild>
            <Button variant="outline" disabled={isSubmitLoading}>
              {cancelText || "Cancel"}
            </Button>
          </CredenzaClose>
          <Button
            onClick={() => {
              onConfirm && onConfirm();
            }}
            disabled={isSubmitLoading}
            className="bg-red-600 focus:ring-red-600"
          >
            {isSubmitLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{confirmText || "Delete"}</span>
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
