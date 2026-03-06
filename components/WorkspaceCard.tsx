"use client";
import Link from "next/link";
import { Layout, Trash2Icon } from "lucide-react";
import { useState } from "react";
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
import { deleteWorkspace } from "@/features/workspace/actions";

interface WorkspaceCardProps {
  id: string;
  title: string;
  description: string;
  deleteBtn?: boolean;
}

export const WorkspaceCard = ({
  id,
  title,
  description,
}: WorkspaceCardProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await deleteWorkspace(id);
    setOpen(false);
  };

  return (
    <>
      <Link href={`/workspace/${id}`}>
        <div className="border rounded-lg p-4 max-w-2xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex ">
            <h3 className="text-lg font-bold text-slate-800 transition-colors mb-2 line-clamp-1">
              {title}
            </h3>
            <div className="flex gap-2 ml-auto">
              <Layout size={20} className="text-slate-400 ml-auto" />
              <Trash2Icon
                size={20}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                className="ml-auto text-slate-400 transition-all duration-200 hover:text-red-600 hover:scale-110 hover:-rotate-6 cursor-pointer"
              />
            </div>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">
            {description || "No description provided."}
          </p>
        </div>
      </Link>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this workspace?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
