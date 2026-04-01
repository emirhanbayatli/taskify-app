"use client";
import { Task } from "@/lib/types";
import { useState } from "react";
import { deleteTask, updateTask } from "@/features/tasks/action";
import { toast } from "sonner";
import ConfirmAlertDialog from "./ConfirmAlertDialog";
import TaskHeader from "./TaskHeader";
import TaskComments from "./TaskComments";
import TaskDetails from "./TaskDetails";

export default function TaskCard({
  taskTitle,
  projectStatus,
  description,
  projectName,
  addMemberBtn,
  members,
  comments,
  onClose,
  id,
  workspaceId,
}: Task) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(taskTitle);
  const [tempDesc, setTempDesc] = useState(description);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [tempProjectStatus, setProjectStatus] = useState(projectStatus ?? "");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateTask = async () => {
    const result = await updateTask({
      taskTitle: tempTitle,
      description: tempDesc,
      projectName: tempProjectName,
      projectStatus: tempProjectStatus,
      id: id,
    });
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setDeleteLoading(true);

    try {
      const result = await deleteTask(id);

      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        onClose?.();
      } else {
        toast.error(result.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempTitle(taskTitle);
    setTempDesc(description);
    setTempProjectName(projectName);
    setProjectStatus(projectStatus || "");
  };

  return (
    <div className="fixed inset-0 z-[50] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-4xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-200 max-h-[95vh] overflow-y-auto">
        <TaskHeader
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          tempProjectStatus={tempProjectStatus}
          setProjectStatus={setProjectStatus}
          tempProjectName={tempProjectName}
          setTempProjectName={setTempProjectName}
          onDeleteClick={() => setDeleteOpen(true)}
          onClose={onClose}
          workspaceId={workspaceId || ""}
          taskId={id as string}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 mt-6 pt-6 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <TaskDetails
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              tempTitle={tempTitle || ""}
              setTempTitle={setTempTitle}
              tempDesc={tempDesc || ""}
              setTempDesc={setTempDesc}
              members={members}
              addMemberBtn={addMemberBtn}
              onUpdateTask={handleUpdateTask}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div className="col-span-1">
            <TaskComments taskId={id as string} initialComments={comments} />
          </div>
        </div>
      </div>
      <ConfirmAlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this task?"
        description="This action cannot be undone. The task and all related data will be permanently deleted."
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        onConfirm={() => handleDeleteTask(id as string)}
        loading={deleteLoading}
      />
    </div>
  );
}
