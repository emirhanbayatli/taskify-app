import { Column as ColumnType, Member, Task, Comment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Column } from "@/components/Column";
import MiniTaskCard from "@/components/MiniTaskCard";
import { SortableColumn } from "@/components/SortableColumn";
import { SortableTask } from "@/components/SortableTask";
import { Button } from "@/components/ui/button";
import { useWorkspaceDnd } from "@/features/hooks/dnd-kit-hooks";

interface WorkspaceBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sensors: SensorDescriptor<SensorOptions>[];
  activeColumn: ColumnType | null;
  setActiveColumn: React.Dispatch<React.SetStateAction<ColumnType | null>>;
  activeTask: Task | null;
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>;
  onAddColumn: () => void;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export default function WorkspaceBoard({
  columns,
  tasks,
  setColumns,
  setTasks,
  sensors,
  activeColumn,
  setActiveColumn,
  activeTask,
  setActiveTask,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onTaskClick,
}: WorkspaceBoardProps) {
  const { handleDragStart, handleDragOver, handleDragEnd } = useWorkspaceDnd({
    columns,
    tasks,
    setColumns,
    setTasks,
    setActiveColumn,
    setActiveTask,
  });

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex gap-4 p-4 overflow-x-auto items-start">
        <SortableContext
          items={columns.map((c) => c.id as string)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((col) => {
            const columnTasks = tasks.filter(
              (task) => task.columnId === col.id,
            );

            return (
              <SortableColumn key={col.id} column={col}>
                <Column
                  title={col.title}
                  onEdit={() => onEditColumn(col.id as string)}
                  onDelete={() => onDeleteColumn(col.id as string)}
                  onAddTask={() => onAddTask(col.id as string)}
                >
                  <SortableContext
                    items={columnTasks.map((t) => t.id as string)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <SortableTask key={task.id} task={task}>
                        <MiniTaskCard
                          taskTitle={task.taskTitle}
                          description={task.description}
                          projectName={task.projectName}
                          comments={task.comments as Comment[]}
                          members={task.members as Member[]}
                          workspaceId={task.workspaceId || ""}
                          projectId={task.projectId as string}
                          onClick={() => onTaskClick(task)}
                          createdAt={formatDate(task.createdAt as string)}
                        />
                      </SortableTask>
                    ))}
                  </SortableContext>
                </Column>
              </SortableColumn>
            );
          })}
        </SortableContext>
        <div className="flex flex-col items-start min-w-[250px]">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all gap-2"
            onClick={onAddColumn}
          >
            <Plus size={18} /> Add Column
          </Button>
        </div>
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.5" } },
          }),
        }}
      >
        {activeColumn ? (
          <Column title={activeColumn.title}>
            {tasks
              .filter((t) => t.columnId === activeColumn.id)
              .map((task) => (
                <MiniTaskCard
                  key={task.id}
                  taskTitle={task.taskTitle}
                  description={task.description}
                  projectName={task.projectName}
                  comments={task.comments as Comment[]}
                  members={task.members as Member[]}
                  workspaceId={task.workspaceId || ""}
                  projectId={task.projectId as string}
                  createdAt={formatDate(task.createdAt as string)}
                />
              ))}
          </Column>
        ) : null}
        {activeTask ? (
          <MiniTaskCard
            taskTitle={activeTask.taskTitle}
            description={activeTask.description}
            projectName={activeTask.projectName}
            comments={activeTask.comments as Comment[]}
            members={activeTask.members as Member[]}
            workspaceId={activeTask.workspaceId || ""}
            projectId={activeTask.projectId as string}
            createdAt={formatDate(activeTask.createdAt as string)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
