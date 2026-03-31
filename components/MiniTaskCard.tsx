"use client";
import { MiniTaskCardProps } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageCircle, Calendar } from "lucide-react";

export default function MiniTaskCard({
  projectName,
  createdAt,
  taskTitle,
  onClick,
  comments = [],
  members = [],
}: MiniTaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 w-full max-w-sm border border-gray-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 w-fit">
            {projectName}
          </span>
          <h3 className="font-semibold text-gray-800 leading-snug">
            {taskTitle}
          </h3>
        </div>
        {members.length > 0 && (
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {members[0]?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{createdAt}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          <span>{comments.length}</span>
        </div>
      </div>
    </div>
  );
}
