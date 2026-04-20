import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Comment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  addCommentToTask,
  deleteCommentFromTask,
  updateCommentInTask,
} from "@/features/comment/action";

interface TaskCommentsProps {
  taskId: string;
  initialComments?: Comment[];
}

export default function TaskComments({
  taskId,
  initialComments,
}: TaskCommentsProps) {
  const { user } = useAuth();
  const [localComments, setLocalComments] = useState<Comment[]>(
    initialComments || [],
  );
  const [commentMessage, setCommentMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState("");

  useEffect(() => {
    setLocalComments(initialComments || []);
  }, [initialComments]);

  const handleAddComment = async () => {
    if (!commentMessage.trim()) return;

    const newComment = {
      author: {
        id: user?.id as string,
        fullName: user?.fullName as string,
        email: user?.email as string,
      },
      message: commentMessage,
      date: new Date().toISOString(),
    };

    const result = await addCommentToTask({
      taskId,
      ...newComment,
      createdAt: new Date().toISOString(),
    });

    if (result.success) {
      toast.success(result.message);
      setLocalComments((prev) => [
        ...prev,
        { ...newComment, id: String(Date.now()), taskId },
      ]);
      setCommentMessage("");
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await deleteCommentFromTask(taskId, commentId);
    if (result.success) {
      toast.success(result.message);
      setLocalComments((prev) =>
        prev.filter((comment) => String(comment.id) !== commentId),
      );
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    const result = await updateCommentInTask(taskId, commentId, editingMessage);

    if (result.success) {
      toast.success(result.message);
      setLocalComments((prev) =>
        prev.map((c) =>
          String(c.id) === commentId ? { ...c, message: editingMessage } : c,
        ),
      );
      setEditingCommentId(null);
      setEditingMessage("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[350px] md:h-[450px]">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Comments
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
          {localComments?.length || 0}
        </span>
      </h3>

      <ScrollArea className="flex-1 overflow-y-auto pr-4 mb-4 custom-scrollbar">
        <div className="space-y-4">
          {[...localComments].reverse().map((comment: Comment, index) => (
            <div key={comment.id ?? index} className="group flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="text-[10px]">
                  {comment.author.fullName
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-xs text-gray-900 truncate">
                    {comment.author.fullName}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {formatDate(comment.updatedAt || comment.createdAt || "")}
                  </span>
                </div>
                {editingCommentId === String(comment.id) ? (
                  <div className="mt-1 space-y-2">
                    <Textarea
                      value={editingMessage}
                      onChange={(e) => setEditingMessage(e.target.value)}
                      className="text-xs min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => handleUpdateComment(String(comment.id))}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingMessage("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors break-words">
                    {comment.message}
                  </p>
                )}
                {comment.author.id === user?.id && (
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => {
                        setEditingCommentId(String(comment.id));
                        setEditingMessage(comment.message);
                      }}
                      className="text-[10px] text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(String(comment.id))}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-2 mt-auto pt-2 border-t border-gray-100">
        <Textarea
          placeholder="Write a comment..."
          className="text-sm min-h-[80px] focus:ring-indigo-500 resize-none"
          value={commentMessage}
          onChange={(e) => setCommentMessage(e.target.value)}
        />
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 h-10"
          onClick={handleAddComment}
        >
          Post Comment
        </Button>
      </div>
    </div>
  );
}
