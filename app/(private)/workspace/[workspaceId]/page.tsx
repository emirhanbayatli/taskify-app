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
import { useEffect, useState } from "react";
import {
  Column as ColumnType,
  Member,
  Task,
  Comment,
  Workspace as WorkspaceType,
} from "@/lib/types";
import { ColumnModal } from "@/components/ColumnModal";
import { createTask, getTaskByWorkspaceId } from "@/features/tasks/action";
import MiniTaskCard from "@/components/MiniTaskCard";
import { TaskModal } from "@/components/TaskModal";
import TaskCard from "@/components/TaskCard";
import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import { getWorkspaceWithId } from "@/features/workspace/actions";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import {
  addMemberToTask,
  removeMemberToTask,
  removeMemberToWorkspace,
} from "@/features/members/actions";
import { formatTaskDate } from "@/lib/utils";
import { MemberSelectModal } from "@/components/MemberSelectModal";

export default function Workspace() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { user } = useAuth();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceType>();
  const [columnId, setColumnId] = useState("");
  const [openAddModal, setAddOpenModal] = useState(false);
  const [openUpdateModal, setUpdateOpenModal] = useState(false);
  const [openAddTaskModal, setAddTaskOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [openAddMemberToTaskModal, setOpenAddMemberToTaskModal] =
    useState(false);

  async function fetchAllData() {
    const columnsResult = await getColumnByWorkspaceId(workspaceId);
    setColumns(columnsResult as ColumnType[]);

    const tasksResult = await getTaskByWorkspaceId(workspaceId);
    setTasks(tasksResult as unknown as Task[]);

    const workspaceResult = await getWorkspaceWithId(workspaceId);
    setWorkspace(workspaceResult as WorkspaceType);
  }

  useEffect(() => {
    if (!workspaceId) return;
    fetchAllData();
  }, [workspaceId]);

  const handleInvite = async (email: string) => {
    const response = await fetch("/api/invite/send", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        workspaceId: workspaceId,
        workspaceName: workspace?.workspaceName,
        invitedBy: user?.id,
      }),
    });

    if (response.ok) toast.success("Invitation email sent successfully!");
  };
  async function handleCreateColumn(data: { field1: string }) {
    const result = await createColumn({
      title: data.field1,
      workspaceId,
      order: columns.length + 1,
    });
    if (result.success) {
      toast.success(result.message);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }
  async function handleDeleteColumn(columnId: string, workspaceId: string) {
    const result = await deleteColumn(columnId, workspaceId);
    if (result.success) {
      toast.success(result.message);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }
  async function handleUpdateColumn(
    data: { field1: string },
    columnId: string,
  ) {
    const result = await updateColumn({
      title: data.field1,
      columnId: columnId,
      order: columns.length + 1,
    });
    if (result.success) {
      toast.success(result.message);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }
  async function handleCreateTask(data: {
    taskTitle: string;
    description: string;
    projectName: string;
    workspaceId: string;
    columnId: string;
  }) {
    const result = await createTask({
      taskTitle: data.taskTitle || "",
      description: data.description || "",
      projectName: data.projectName || "",
      workspaceId,
      columnId,
      selectedMembers: [],
    });
    if (result.success) {
      toast.success(result.message);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }

  async function handleAddMemberToTask(taskId: string, member: Member) {
    const result = await addMemberToTask({ taskId, member });
    if (result.success) {
      toast.success(result.message);
      setOpenAddMemberToTaskModal(false);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }
  async function handleRemoveMemberFromTask(taskId: string, member: Member) {
    const result = await removeMemberToTask(member, taskId);
    if (result.success) {
      toast.success(result.message);
      setOpenAddMemberToTaskModal(false);
      setSelectedTask(null);
      await fetchAllData();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      {workspace && (
        <WorkspaceHeader
          name={workspace?.workspaceName}
          description={workspace?.workspaceDesc}
          onInvite={() => setOpenAddMemberModal(true)}
          members={workspace?.members as Member[]}
          onRemoveMember={async (memberId: string) => {
            const result = await removeMemberToWorkspace(memberId, workspaceId);
            if (result.success) {
              toast.success(result.message);
              await fetchAllData();
            } else {
              toast.error(result.message);
            }
          }}
        />
      )}
      <div className="flex gap-4 p-4 overflow-x-auto min-h-screen">
        {columns.map((col) => (
          <Column
            key={col.id}
            title={col.title}
            onEdit={() => {
              setColumnId(col.id as string);
              setUpdateOpenModal(true);
            }}
            onDelete={async () => {
              await handleDeleteColumn(col.id as string, workspaceId);
            }}
            onAddTask={() => {
              setColumnId(col.id as string);
              setAddTaskOpenModal(true);
            }}
          >
            {tasks
              .filter((task) => task.columnId === col.id)
              .map((task, index) => (
                //  <Sortable id={Number(task.taskId)} index={index} />
                <MiniTaskCard
                  key={task.id || `${col.id}-${index}`}
                  taskTitle={task.taskTitle}
                  description={task.description}
                  projectName={task.projectName}
                  comments={task.comments as Comment[]}
                  members={task.members as Member[]}
                  workspaceId={task.workspaceId || ""}
                  projectId={task.projectId as string}
                  onClick={() => {
                    setSelectedTask(task);
                  }}
                  createdAt={formatTaskDate(task.createdAt as string)}
                />
              ))}
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
              handleCreateColumn(data);
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
              handleUpdateColumn(data, columnId);
            }}
          />
        )}
        {openAddTaskModal && (
          <TaskModal
            setOpenModal={setAddTaskOpenModal}
            title="Add New Task"
            btnLabel="Add Task"
            onSubmitAction={async (data) => {
              handleCreateTask({
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
            id={selectedTask.id}
            taskTitle={selectedTask?.taskTitle || ""}
            description={selectedTask?.description || ""}
            projectName={selectedTask?.projectName || ""}
            projectStatus={
              columns.find((col) => col.id === selectedTask.columnId)?.title ||
              ""
            }
            onClose={() => {
              (setSelectedTask(null), fetchAllData());
            }}
            members={selectedTask?.members as Member[]}
            comments={selectedTask?.comments as Comment[]}
            workspaceId={selectedTask?.workspaceId || ""}
            columnId={selectedTask?.columnId || ""}
            addMemberBtn={() => setOpenAddMemberToTaskModal(true)}
          />
        )}
        {openAddMemberModal && (
          <ColumnModal
            setOpenModal={setOpenAddMemberModal}
            title={"Add New Member"}
            firstInputLabel={"Member Email"}
            btnLabel={"Add Member"}
            onSubmitAction={async (data) => {
              await handleInvite("eb.emirhan.eb@gmail.com"); //TODO: data.field1 email bilgisi ile guncellenecek modal hazirlanmasi gerekiyor
            }}
          />
        )}
        {openAddMemberToTaskModal && (
          <MemberSelectModal
            isOpen={openAddMemberToTaskModal}
            onClose={() => setOpenAddMemberToTaskModal(false)}
            workspaceMembers={workspace?.members as Member[]}
            currentTaskMembers={selectedTask?.members as Member[]}
            onSelectMember={async (member: Member) => {
              await handleAddMemberToTask(selectedTask?.id as string, member);
              setSelectedTask(null);
            }}
            onRemoveMember={async (member: Member) => {
              await handleRemoveMemberFromTask(
                selectedTask?.id as string,
                member,
              );
              //await fetchAllData();
            }}
          />
        )}
      </div>
    </div>
  );
}
