"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ConfirmAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (inputValue?: string) => void | Promise<void>;
  loading?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  requireInput?: boolean;
}

export default function ConfirmAlertDialog({
  open,
  onOpenChange,
  title,
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  inputLabel,
  inputPlaceholder,
  requireInput = false,
}: ConfirmAlertDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const handleConfirm = async () => {
    if (requireInput && !inputValue.trim()) return;

    try {
      await onConfirm(requireInput ? inputValue : undefined);

      setInputValue("");
      onOpenChange(false);
    } catch (err) {
      console.error("Error in ConfirmAlertDialog:", err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {inputLabel && (
          <div className="mt-2 space-y-2">
            <label className="text-sm font-medium">{inputLabel}</label>
            <input
              type="password"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
