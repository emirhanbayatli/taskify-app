import { Button } from "@/components/ui/button";
import { Share2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TaskHeaderProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  tempProjectStatus: string;
  setProjectStatus: (val: string) => void;
  tempProjectName: string;
  setTempProjectName: (val: string) => void;
  onDeleteClick: () => void;
  onClose?: () => void;
  workspaceId: string;
  taskId: string;
}

export default function TaskHeader({
  isEditing,
  setIsEditing,
  tempProjectStatus,
  setProjectStatus,
  tempProjectName,
  setTempProjectName,
  onDeleteClick,
  onClose,
  workspaceId,
  taskId,
}: TaskHeaderProps) {
  const router = useRouter();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/workspace/${workspaceId}/tasks/${taskId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <span
              onClick={() => setIsEditing(true)}
              className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 cursor-pointer"
            >
              {tempProjectStatus || "No Status"}
            </span>
            <input
              className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none w-24 sm:w-32"
              value={tempProjectName}
              onChange={(e) => setTempProjectName(e.target.value)}
              placeholder="Project Name..."
            />
          </>
        ) : (
          <>
            <span
              onClick={() => setIsEditing(true)}
              className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 cursor-pointer"
            >
              {tempProjectStatus || "No Status"}
            </span>
            <span
              onClick={() => setIsEditing(true)}
              className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 cursor-pointer"
            >
              {tempProjectName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteClick}
          className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleShare}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (onClose) onClose();
            router.push(`/workspace/${workspaceId}`);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
