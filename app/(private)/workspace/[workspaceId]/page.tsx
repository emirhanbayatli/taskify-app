"use client";
import {
  createColumn,
  deleteColumn,
  getColumnByWorkspaceId,
  updateColumn,
} from "@/features/column/actions";
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
import { MemberSelectModal } from "@/components/MemberSelectModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import ConfirmAlertDialog from "@/components/ConfirmAlertDialog";
import WorkspaceBoard from "@/components/WorkspaceBoard";

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
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [openDeleteColumnDialog, setOpenDeleteColumnDialog] = useState(false);

  const columnTasks = tasks.filter((t) => t.columnId === columnId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  async function fetchAllData() {
    const columnsResult = (await getColumnByWorkspaceId(
      workspaceId,
    )) as ColumnType[];

    setColumns(
      [...columnsResult].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );

    const tasksResult = (await getTaskByWorkspaceId(
      workspaceId,
    )) as unknown as Task[];

    setTasks([...tasksResult].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

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
      setColumns((prev) => [...prev, result.data as ColumnType]);
    } else {
      toast.error(result.message);
    }
  }

  const handleDeleteColumn = async () => {
    if (!deleteColumnId) return;

    const result = await deleteColumn(deleteColumnId);

    if (result.success) {
      toast.success(result.message);
      setColumns((prev) => prev.filter((col) => col.id !== deleteColumnId));
      setTasks((prev) =>
        prev.filter((task) => task.columnId !== deleteColumnId),
      );
    } else {
      toast.error(result.message);
    }

    setDeleteColumnId(null);
  };

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
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, title: data.field1 } : col,
        ),
      );
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
      order: columnTasks.length + 1,
    });

    if (result.success && result.data) {
      toast.success(result.message);
      setTasks((prev) => [...prev, result.data as Task]);
      setAddTaskOpenModal(false);
    } else {
      toast.error(result.message);
    }
  }
  async function handleAddMemberToTask(taskId: string, member: Member) {
    const result = await addMemberToTask({ taskId, member });
    if (result.success) {
      toast.success(result.message);

      setSelectedTask((prev) =>
        prev ? { ...prev, members: [...(prev.members || []), member] } : prev,
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, members: [...(task.members || []), member] }
            : task,
        ),
      );
    } else {
      toast.error(result.message);
    }
  }
  async function handleRemoveMemberFromTask(taskId: string, member: Member) {
    const result = await removeMemberToTask(member, taskId);
    if (result.success) {
      toast.success(result.message);
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members?.filter((m) => m.id !== member.id),
            }
          : prev,
      );
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {workspace ? (
        <WorkspaceHeader
          name={workspace?.workspaceName}
          description={workspace?.workspaceDesc}
          onInvite={() => setOpenAddMemberModal(true)}
          members={workspace?.members as Member[]}
          onRemoveMember={async (memberId: string) => {
            const result = await removeMemberToWorkspace(memberId, workspaceId);
            if (result.success) {
              toast.success(result.message);
              setWorkspace((prev) =>
                prev
                  ? {
                      ...prev,
                      members: prev.members?.filter((m) => m.id !== memberId),
                    }
                  : prev,
              );
            } else {
              toast.error(result.message);
            }
          }}
        />
      ) : (
        <LoadingSpinner />
      )}

      <WorkspaceBoard
        columns={columns}
        tasks={tasks}
        setColumns={setColumns}
        setTasks={setTasks}
        sensors={sensors}
        activeColumn={activeColumn}
        setActiveColumn={setActiveColumn}
        activeTask={activeTask}
        setActiveTask={setActiveTask}
        onAddColumn={() => setAddOpenModal(true)}
        onEditColumn={(colId) => {
          setColumnId(colId);
          setUpdateOpenModal(true);
        }}
        onDeleteColumn={(colId) => {
          setDeleteColumnId(colId);
          setOpenDeleteColumnDialog(true);
        }}
        onAddTask={(colId) => {
          setColumnId(colId);
          setAddTaskOpenModal(true);
        }}
        onTaskClick={(task) => setSelectedTask(task)}
      />

      {openAddModal && (
        <ColumnModal
          setOpenModal={setAddOpenModal}
          title="Add New Column"
          firstInputLabel="Column Name"
          btnLabel="Add Column"
          onSubmitAction={async (data) => handleCreateColumn(data)}
        />
      )}
      {openUpdateModal && (
        <ColumnModal
          setOpenModal={setUpdateOpenModal}
          currentValue={columns.find((col) => col.id === columnId)?.title}
          title="Update Column"
          firstInputLabel="Column Name"
          btnLabel="Update Column"
          onSubmitAction={async (data) => handleUpdateColumn(data, columnId)}
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
            columns.find((col) => col.id === selectedTask.columnId)?.title || ""
          }
          onClose={() => {
            setSelectedTask(null);
            fetchAllData();
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
            await handleInvite(data.field1);
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
          }}
          onRemoveMember={async (member: Member) => {
            await handleRemoveMemberFromTask(
              selectedTask?.id as string,
              member,
            );
          }}
        />
      )}
      <ConfirmAlertDialog
        open={openDeleteColumnDialog}
        onOpenChange={setOpenDeleteColumnDialog}
        title="Delete this column?"
        description="This action cannot be undone. All tasks inside this column will also be affected."
        confirmText="Delete"
        cancelText="Cancel"
        loading={false}
        onConfirm={handleDeleteColumn}
      />
    </div>
  );
}
