"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                href="/tasks/new"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Add Task
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-8 w-8 ">
                    <AvatarFallback className="text-gray-800 font-bold">
                      {user.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl border bg-popover p-2 shadow-lg">
                    <div className="px-3 py-2 border-b mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
