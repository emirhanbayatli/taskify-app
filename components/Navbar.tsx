"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 md:px-10 py-3 h-16">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Taskify
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              Dashboard
            </Link>
            <Link
              href="/workspace"
              className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              Workspace
            </Link>
            <Link
              href="/tasks"
              className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              Tasks
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                href="/tasks/new"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Add Task
              </Link>

              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center outline-none group">
                      <Avatar className="h-9 w-9  group-hover:ring-indigo-100 transition-all shadow-sm">
                        <AvatarFallback className="bg-indigo-50 text-gray-800 font-bold border border-indigo-100">
                          {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 p-2 rounded-xl shadow-xl"
                  >
                    <DropdownMenuLabel className="p-3">
                      <p className="text-sm font-bold text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem className="flex items-center p-2 rounded-lg cursor-pointer">
                      <User className="mr-3 h-4 w-4 text-muted-foreground" />
                      <Link href="/profile" className="font-medium">
                        My Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center p-2 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
