"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import TaskCard from "@/components/TaskCard";
import { getTaskWithId } from "@/features/tasks/action";
import { Member, Task, Comment } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TaskDetail() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(true);

  async function fetchTaskWithId(id: string) {
    try {
      const result = await getTaskWithId(id);
      console.log(result.data, "task detail result");
      if (result.success) {
        setTask(result.data as Task);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while loading the task.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (taskId) {
      fetchTaskWithId(taskId);
    }
  }, [taskId]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner label="Loading task details..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-gray-500">
        Task not found.
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {loading ?? <LoadingSpinner />}
      <TaskCard
        //TODO: project status ekle
        id={task?.id}
        taskTitle={task?.taskTitle || "Test Task"}
        description={task?.description || "This is a test task"}
        projectName={task?.projectName || "Test Project"}
        members={task?.members as Member[]}
        comments={task?.comments as Comment[]}
        workspaceId={task?.workspaceId || ""}
        columnId={task?.columnId || ""}
      />
    </div>
  );
}
