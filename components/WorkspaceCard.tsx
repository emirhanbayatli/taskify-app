"use client";
import Link from "next/link";
import { Edit, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { deleteWorkspace, updateWorkspace } from "@/features/workspace/actions";
import { InputModal } from "./InputModal";
import { toast } from "sonner";
import ConfirmAlertDialog from "./ConfirmAlertDialog";

interface WorkspaceCardProps {
  id: string;
  title: string;
  description: string;
  deleteBtn?: boolean;
  onRefresh: () => Promise<void>;
}

export const WorkspaceCard = ({
  id,
  title,
  description,
  onRefresh,
}: WorkspaceCardProps) => {
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleDelete = async () => {
    const result = await deleteWorkspace(id);
    if (result.success) {
      toast.success(result.message);
      await onRefresh();
    } else {
      toast.error(result.message);
    }
    setOpen(false);
  };

  const handleUpdate = async (
    data: { field1: string; field2: string },
    id: string,
  ) => {
    const result = await updateWorkspace(id, data.field1, data.field2);
    if (result.success) {
      toast.success(result.message);
      await onRefresh();
    } else {
      toast.error(result.message);
    }
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
              <Edit
                size={20}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenEditModal(true);
                }}
                className="text-slate-400 transition-all duration-200 hover:text-blue-600 hover:scale-110 hover:rotate-6 cursor-pointer"
              />
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
      <ConfirmAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you sure you want to delete this workspace?"
        description="This action cannot be undone. This will permanently delete the workspace."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
      {openEditModal && (
        <InputModal
          setOpenModal={setOpenEditModal}
          title="Edit Workspace"
          firstInputLabel="Workspace Name"
          secondInputLabel="Description"
          btnLabel="Update"
          onSubmitAction={async (data) => {
            handleUpdate(data, id);
            setOpenEditModal(false);
          }}
        />
      )}
    </>
  );
};
