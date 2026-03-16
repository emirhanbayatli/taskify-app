"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Member } from "@/lib/types";
import { UserPlus, X, Search, Plus, Minus } from "lucide-react";

interface MemberSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceMembers: Member[];
  currentTaskMembers: Member[];
  onSelectMember: (member: Member) => void;
  onRemoveMember: (member: Member) => void;
}

export function MemberSelectModal({
  isOpen,
  onClose,
  workspaceMembers,
  currentTaskMembers,
  onSelectMember,
  onRemoveMember,
}: MemberSelectModalProps) {
  const isMemberInTask = (memberId: string) => {
    return currentTaskMembers?.some((member) => member.id === memberId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl z-[100] bg-white rounded-2xl"
        showCloseButton={false}
      >
        <div className="relative p-6 pb-4 border-b border-gray-50">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Assign Members
              </DialogTitle>
            </div>
          </div>
        </div>

        <div className="p-4">
          <ScrollArea className="h-[350px] pr-4 pl-2">
            <div className="space-y-1.5 py-2">
              {workspaceMembers?.length > 0 ? (
                workspaceMembers.map((member) => {
                  const alreadySelected = isMemberInTask(member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => !alreadySelected && onSelectMember(member)}
                      className={
                        " group flex items-center justify-between p-3 rounded-xl transition-all duration-200"
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="border-2 border-white w-8 h-8">
                            <AvatarFallback className="text-[10px] bg-gray-200">
                              {member.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {member.fullName}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {member.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {alreadySelected ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            onClick={() => onRemoveMember(member)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors border border-gray-100"
                            onClick={() => onSelectMember(member)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-3">
                    <Search className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    No members found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Invite people to your workspace first.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
