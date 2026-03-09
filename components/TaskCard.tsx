"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2, X } from "lucide-react";
import { Task } from "@/lib/types";

export default function TaskCard({
  taskTitle,
  projectStatus,
  description,
  projectName,
  addCommentBtn,
  addMemberBtn,
  members,
  comments,
  onClose,
}: Task) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className=" bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl border border-gray-200">
        <div className="flex justify-between gap-2">
          <div>
            <span className="text-sm mr-4 font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {projectStatus}
            </span>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {projectName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span
              className="p-2 rounded-md hover:bg-accent hover:text-foreground transition"
              aria-label="Share task"
            >
              <Share2 className="h-4 w-4" />
            </span>

            <button
              className="p-2 rounded-md hover:bg-red-100 hover:text-red-600 transition"
              aria-label="Close"
            >
              <X onClick={onClose} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-gray-200 mt-4 pt-4 gap-6">
          <div className="mb-6 col-span-2">
            <h2 className="text-xl font-semibold text-gray-800">{taskTitle}</h2>
            <div className="my-4 flex">
              <p>Members : </p>
              {members?.map((member, i) => (
                <Avatar key={i} className="-ml-2 border-2 border-white">
                  <AvatarFallback>
                    {member.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              <Avatar className="ml-2">
                <AvatarFallback className="cursor-pointer">+</AvatarFallback>
              </Avatar>
            </div>
            <ScrollArea className="h-40 max-w-2xl">
              <p className="text-gray-600 text-sm ">{description}</p>
            </ScrollArea>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">Comments</h3>
            <ScrollArea className="h-40">
              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {comment.author.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.author.fullName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.date}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Textarea placeholder="Yorum yaz..." />
              <div className="flex justify-end">
                <Button onClick={() => {}}>Add Comment</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
