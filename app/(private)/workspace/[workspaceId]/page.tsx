"use client";
import { Column } from "@/components/Column";
import { Button } from "@/components/ui/button";
import {
  createColumn,
  deleteColumn,
  getColumnByWorkspaceId,
  updateColumn,
} from "@/features/column/actions";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Column as ColumnType, Member, Task, Comment } from "@/lib/types";
import { ColumnModal } from "@/components/ColumnModal";
import { createTask, getTaskByWorkspaceId } from "@/features/task/action";
import MiniTaskCard from "@/components/MiniTaskCard";
import { TaskModal } from "@/components/TaskModal";
import TaskCard from "@/components/TaskCard";

export default function Workspace() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columnId, setColumnId] = useState("");
  const [openAddModal, setAddOpenModal] = useState(false);
  const [openUpdateModal, setUpdateOpenModal] = useState(false);
  const [openAddTaskModal, setAddTaskOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchColumns() {
      const result = await getColumnByWorkspaceId(workspaceId);
      setColumns(result as ColumnType[]);
    }
    fetchColumns();
    async function fetchTasks() {
      const result = await getTaskByWorkspaceId(workspaceId);
      setTasks(result as unknown as Task[]);
    }
    fetchTasks();
  }, [workspaceId]);

  return (
    <div className="flex gap-4 p-4">
      {columns.map((col) => (
        <Column
          key={col.id}
          title={col.title}
          onEdit={() => {
            setColumnId(col.id as string);
            setUpdateOpenModal(true);
          }}
          onDelete={() => deleteColumn(col.id as string)}
          onAddTask={() => {
            setColumnId(col.id as string);
            setAddTaskOpenModal(true);
          }}
        >
          <>
            {tasks
              .filter((task) => task.columnId === col.id)
              .map((task) => (
                <MiniTaskCard
                  key={task.taskId}
                  taskTitle={task.taskTitle}
                  description={task.description}
                  projectName={task.projectName}
                  comments={task.comments as Comment[]}
                  members={task.members as Member[]}
                  workspaceId={task.workspaceId}
                  projectId={task.projectId as string}
                  onClick={() => {
                    setSelectedTask(task);
                  }}
                />
              ))}
          </>
        </Column>
      ))}
      <div className="flex flex-col items-start">
        <Button
          variant="ghost"
          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all gap-2"
          onClick={() => {
            setAddOpenModal(true);
          }}
        >
          <Plus size={18} /> Add Column
        </Button>
      </div>
      {openAddModal && (
        <ColumnModal
          setOpenModal={setAddOpenModal}
          title="Add New Column"
          firstInputLabel="Column Name"
          btnLabel="Add Column"
          onSubmitAction={async (data) => {
            await createColumn({
              title: data.field1,
              workspaceId,
              order: columns.length + 1,
            });
          }}
        />
      )}
      {openUpdateModal && (
        <ColumnModal
          setOpenModal={setUpdateOpenModal}
          title="Update Column"
          firstInputLabel="Column Name"
          btnLabel="Update Column"
          onSubmitAction={async (data) => {
            await updateColumn({
              title: data.field1,
              columnId: columnId,
              order: columns.length + 1,
            });
          }}
        />
      )}
      {openAddTaskModal && (
        <TaskModal
          setOpenModal={setAddTaskOpenModal}
          title="Add New Task"
          btnLabel="Add Task"
          onSubmitAction={async (data) => {
            await createTask({
              taskTitle: data.taskTitle || "",
              description: data.description || "",
              projectName: data.projectName || "",
              workspaceId,
              columnId,
            });
          }}
        />
      )}
      {selectedTask && (
        <TaskCard
          taskTitle={selectedTask?.taskTitle || "Test Task"}
          description={selectedTask?.description || "This is a test task"}
          projectName={selectedTask?.projectName || "Test Project"}
          members={[]}
          comments={[]}
          onClose={() => setSelectedTask(null)}
          workspaceId={selectedTask?.workspaceId || ""}
          columnId={selectedTask?.columnId || ""}
        />
      )}
    </div>
  );
}
