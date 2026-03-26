"use client";
import MiniTaskCard from "@/components/MiniTaskCard";
import { useAuth } from "@/features/auth/AuthProvider";
import { getTaskWithMemberId } from "@/features/tasks/action";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ListTodo } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    if (!user) return;
    try {
      const result = await getTaskWithMemberId(user.id || "");
      if (result) setTasks(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [user?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            You have{" "}
            <span className="text-foreground font-semibold">
              {tasks.length} tasks
            </span>{" "}
            assigned to you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-blue-50`}>
            <ListTodo className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            My Recent Tasks
          </h2>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="transition-transform hover:scale-[1.02] duration-200"
              >
                <Link href={`/workspace/${task.workspaceId}/tasks/${task.id}`}>
                  <MiniTaskCard
                    taskTitle={task.taskTitle}
                    description={task.description}
                    projectName={task.projectName}
                    comments={task.comments || []}
                    members={task.members || []}
                    workspaceId={task.workspaceId}
                    projectId={task.projectId}
                    createdAt={formatDate(task.createdAt)}
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-6">
            <p className="text-muted-foreground italic">
              No tasks assigned to you yet. Time to take a break! ☕
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
