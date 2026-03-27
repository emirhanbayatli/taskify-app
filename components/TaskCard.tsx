"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2, X, Save, RotateCcw, Trash2 } from "lucide-react";
import { Comment, Task } from "@/lib/types";
import { useState, useEffect } from "react";
import { deleteTask, updateTask } from "@/features/tasks/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  addCommentToTask,
  deleteCommentFromTask,
  updateCommentInTask,
} from "@/features/comment/action";
import { useAuth } from "@/features/auth/AuthProvider";
import { formatDate } from "@/lib/utils";

export default function TaskCard({
  taskTitle,
  projectStatus,
  description,
  projectName,
  addMemberBtn,
  members,
  comments,
  onClose,
  id,
  workspaceId,
}: Task) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(taskTitle);
  const [tempDesc, setTempDesc] = useState(description);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [tempProjectStatus, setProjectStatus] = useState(projectStatus ?? "");
  const [commentMessage, setCommentMessage] = useState("");
  const [localComments, setLocalComments] = useState(comments || []);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState("");

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleUpdateTask = async () => {
    const result = await updateTask({
      taskTitle: tempTitle,
      description: tempDesc,
      projectName: tempProjectName,
      projectStatus: tempProjectStatus,
      id: id,
    });
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const result = await deleteTask(id);
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false);
      if (onClose) onClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/workspace/${workspaceId}/tasks/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

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
      taskId: id as string,
      ...newComment,
      createdAt: new Date().toISOString(),
    });

    if (result.success) {
      toast.success(result.message);

      setLocalComments((prev) => [
        ...prev,
        { ...newComment, id: String(Date.now()), taskId: id as string },
      ]);

      setCommentMessage("");
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteComment = async (taskId: string, commentId: string) => {
    console.log(
      "Deleting comment with ID:",
      commentId,
      "from task ID:",
      taskId,
    );
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

  const handleUpdateComment = async (taskId: string, commentId: string) => {
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
    // TODO: Mobil gorunumu duzeltilecek
    <div className="fixed inset-0 z-[50]  flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-gray-200 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <input
                  className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none w-32"
                  value={tempProjectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  placeholder="Status..."
                />
                <input
                  className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none w-32"
                  value={tempProjectName}
                  onChange={(e) => setTempProjectName(e.target.value)}
                  placeholder="Project Name..."
                />
              </>
            ) : (
              <>
                <span
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                >
                  {tempProjectStatus || "No Status"}
                </span>
                <span
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700"
                >
                  {tempProjectName}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteTask(id as string)}
              className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
              aria-label="Share"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                if (onClose) onClose();
                router.push(`/workspace/${workspaceId}`);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 mt-6 pt-6 gap-8">
          <div className="col-span-2 space-y-6">
            <div>
              {isEditing ? (
                <input
                  className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none w-full bg-transparent pb-1"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  autoFocus
                />
              ) : (
                <h2
                  className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {tempTitle}
                </h2>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
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
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </span>
              {isEditing ? (
                <ScrollArea className="h-32 w-full rounded-md border border-transparent hover:border-gray-100 p-2 transition-all cursor-pointer">
                  <Textarea
                    value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)}
                    className="min-h-[150px] focus:ring-2 focus:ring-blue-500 border-gray-200 resize-none"
                    placeholder="Task description..."
                  />
                </ScrollArea>
              ) : (
                <ScrollArea
                  className="h-32 w-full rounded-md border border-transparent hover:border-gray-100 p-2 transition-all cursor-pointer"
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
                  onClick={handleUpdateTask}
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-2"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setTempTitle(taskTitle);
                    setTempDesc(description);
                    setTempProjectName(projectName);
                    setProjectStatus(projectStatus || "");
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col h-[400px]">
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
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-gray-900">
                          {comment.author.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(
                            comment.updatedAt || comment.createdAt || "",
                          )}
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
                              onClick={() =>
                                handleUpdateComment(
                                  id as string,
                                  String(comment.id),
                                )
                              }
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
                        <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                          {comment.message}
                        </p>
                      )}
                      {comment.author.id === user?.id && (
                        <div className="flex gap-2 mt-1">
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
                            onClick={() =>
                              handleDeleteComment(
                                id as string,
                                String(comment.id),
                              )
                            }
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

            <div className="space-y-2 mt-auto pt-2 border-t border-gray-50">
              <Textarea
                placeholder="Write a comment..."
                className="text-xs min-h-[80px] focus:ring-indigo-500 resize-none"
                value={commentMessage}
                onChange={(e) => setCommentMessage(e.target.value)}
              />
              <Button
                size="sm"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleAddComment()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
