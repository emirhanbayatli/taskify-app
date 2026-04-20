import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, RotateCcw } from "lucide-react";
import { Member } from "@/lib/types";

interface TaskDetailsProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  tempTitle: string;
  setTempTitle: (val: string) => void;
  tempDesc: string;
  setTempDesc: (val: string) => void;
  members?: Member[];
  addMemberBtn?: () => void;
  onUpdateTask: () => void;
  onCancelEdit: () => void;
}

export default function TaskDetails({
  isEditing,
  setIsEditing,
  tempTitle,
  setTempTitle,
  tempDesc,
  setTempDesc,
  members,
  addMemberBtn,
  onUpdateTask,
  onCancelEdit,
}: TaskDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        {isEditing ? (
          <input
            className="text-xl sm:text-2xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none w-full bg-transparent pb-1"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h2
            className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors leading-tight"
            onClick={() => setIsEditing(true)}
          >
            {tempTitle}
          </h2>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Members:
        </span>
        <div className="flex -space-x-2">
          {members?.map((member, i) => (
            <Avatar key={i} className="border-2 border-white w-8 h-8">
              <AvatarFallback className="text-[10px] bg-gray-200">
                {member.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ))}
          <button
            onClick={addMemberBtn}
            className="w-8 h-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors ml-2 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Description
        </span>
        {isEditing ? (
          <div className="w-full rounded-md border border-transparent hover:border-gray-100 transition-all">
            <Textarea
              value={tempDesc}
              onChange={(e) => setTempDesc(e.target.value)}
              className="min-h-[120px] sm:min-h-[150px] focus:ring-2 focus:ring-blue-500 border-gray-200 resize-none text-sm"
              placeholder="Task description..."
            />
          </div>
        ) : (
          <ScrollArea
            className="h-auto max-h-40 w-full rounded-md border border-transparent hover:border-gray-100 p-2 transition-all cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <p className="text-gray-600 leading-relaxed text-sm">
              {tempDesc || "Add a description..."}
            </p>
          </ScrollArea>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onUpdateTask}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-2 flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button
            variant="outline"
            onClick={onCancelEdit}
            className="gap-2 flex-1 sm:flex-none"
          >
            <RotateCcw className="h-4 w-4" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
