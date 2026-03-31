"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import TaskCard from "@/components/TaskCard";
import { getTaskWithId } from "@/features/tasks/action";
import { Task } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TaskDetail() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTask(id: string) {
    try {
      const result = await getTaskWithId(id);

      if (result.success) {
        setTask(result.data as Task);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Task load error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (taskId) fetchTask(taskId);
  }, [taskId]);

  if (loading) {
    return <LoadingSpinner label="Loading task..." />;
  }

  if (!task) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-gray-500">
        Task not found
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <TaskCard
        id={task.id}
        taskTitle={task.taskTitle}
        description={task.description}
        projectName={task.projectName}
        members={task.members}
        comments={task.comments}
        workspaceId={task.workspaceId}
        columnId={task.columnId}
        projectStatus={task.projectStatus}
      />
    </div>
  );
}
