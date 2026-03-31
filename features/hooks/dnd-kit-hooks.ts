import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column as ColumnType, Task } from "@/lib/types";
import { updateTaskOrders } from "../tasks/action";
import { updateColumnOrders } from "../column/actions";

interface UseWorkspaceDndProps {
  columns: ColumnType[];
  tasks: Task[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setActiveColumn: React.Dispatch<React.SetStateAction<ColumnType | null>>;
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export function useWorkspaceDnd({
  columns,
  tasks,
  setColumns,
  setTasks,
  setActiveColumn,
  setActiveTask,
}: UseWorkspaceDndProps) {
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (active.data.current?.type === "Column") {
      setActiveColumn(active.data.current.column);
      return;
    }

    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task);
      return;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        const overIndex = prev.findIndex((t) => t.id === over.id);

        const newTasks = [...prev];

        if (prev[activeIndex].columnId !== prev[overIndex].columnId) {
          newTasks[activeIndex].columnId = prev[overIndex].columnId;
        }

        return arrayMove(newTasks, activeIndex, overIndex);
      });
    }

    if (isOverColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        const newTasks = [...prev];

        newTasks[activeIndex].columnId = over.id as string;

        return newTasks;
      });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const isActiveColumn = active.data.current?.type === "Column";
    const isActiveTask = active.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveColumn) {
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);

      if (oldIndex === newIndex) return;

      const reorderedColumns = arrayMove(columns, oldIndex, newIndex);

      const updated = reorderedColumns.map((col, index) => ({
        ...col,
        order: index + 1,
      }));

      setColumns(updated);

      const response = await updateColumnOrders(updated);

      if (!response.success) {
        setColumns(columns);
      }
      return;
    }

    if (isActiveTask) {
      const activeTask = tasks.find((t) => t.id === active.id);
      if (!activeTask) return;

      let newColumnId = activeTask.columnId;

      const overTask = tasks.find((t) => t.id === over.id);

      if (overTask) {
        newColumnId = overTask.columnId;
      }

      if (isOverColumn) {
        newColumnId = over.id as string;
      }

      const updatedTasks = tasks.map((t) =>
        t.id === active.id ? { ...t, columnId: newColumnId } : t,
      );

      const columnTasks = updatedTasks
        .filter((t) => t.columnId === newColumnId)
        .map((task, index) => ({
          ...task,
          order: index + 1,
        }));

      setTasks(updatedTasks);

      await updateTaskOrders(columnTasks);
    }
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
