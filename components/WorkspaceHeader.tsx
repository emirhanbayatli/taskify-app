"use client";
import { Trash, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Member } from "@/lib/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceHeaderProps {
  name?: string;
  description?: string;
  members: Member[];
  onInvite?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

export function WorkspaceHeader({
  name,
  description,
  onInvite,
  members = [],
  onRemoveMember,
}: WorkspaceHeaderProps) {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex w-full items-center justify-between px-6 md:px-10 h-20">
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {name || "Workspace Name"}
          </h1>
          <p className="text-sm text-slate-500 truncate max-w-[500px]">
            {description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center -space-x-2 overflow-hidden px-2 gap-3">
            {members?.slice(0, 6).map((member) => (
              <DropdownMenu key={member.id}>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm cursor-pointer">
                      <AvatarFallback className="text-gray-800 font-semibold bg-slate-100 ">
                        {member.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm text-center">
                      {member.fullName}
                    </span>
                    <span className="text-xs font-normal text-center text-muted-foreground">
                      {member.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    onClick={() => onRemoveMember?.(member.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove from Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {members.length > 6 && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold border-2 border-white shadow-sm z-10">
                +{members.length - 6}
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-2" />

          <Button
            onClick={onInvite}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-10 flex gap-2 shadow-sm transition-all"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Invite</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
