import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface ColumnProps {
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddTask?: () => void;
  children?: React.ReactNode;
}

export function Column({
  title,
  onEdit,
  onDelete,
  onAddTask,
  children,
}: ColumnProps) {
  return (
    <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-4 w-80 flex flex-col gap-4 shrink-0 h-fit max-h-[85vh]">
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 text-lg tracking-tight">
            {title}
          </h2>
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-md transition-all text-slate-400 hover:text-blue-600"
          >
            <Edit size={16} />
          </button>
        </div>

        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
        {children}

        {!children && (
          <div className="py-8 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
            No tasks yet. Add a task!
          </div>
        )}
      </div>

      <Button
        onClick={onAddTask}
        variant="ghost"
        className="w-full justify-start text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all gap-2"
      >
        <Plus size={18} />
        Add Task
      </Button>
    </div>
  );
}
