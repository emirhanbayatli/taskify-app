"use client";

import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Member } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface WorkspaceHeaderProps {
  name?: string;
  description?: string;
  members: Member[];
  onInvite?: () => void;
}

export function WorkspaceHeader({
  name,
  description,
  onInvite,
  members = [],
}: WorkspaceHeaderProps) {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 md:px-10 h-16">
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {name || "No description provided."}
          </h1>

          <p className="text-sm text-slate-500 truncate max-w-[500px]">
            {description || "No description provided."}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            {members?.slice(0, 5).map((member) => (
              <Avatar
                key={member.id}
                className="h-8 w-8 ring-2 ring-background shadow-sm"
              >
                <AvatarFallback className="text-gray-800 font-semibold bg-slate-100 ">
                  {member.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ))}
            {members && members.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-[11px] font-medium border-2 border-white shadow-sm">
                +{members.length - 5}
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-2">
            <Button
              onClick={onInvite}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-10 flex gap-2"
            >
              <UserPlus size={18} />
              <span className="hidden sm:inline">Add Member</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
