"use client";

import { Bell, Search, LogOut, User as UserIcon } from "lucide-react";
import useAuth from "@/stores/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminHeader = () => {
  const { user, logOut } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AD";

  const roleName =
    user?.role === "super_admin"
      ? "Super Admin"
      : user?.role === "manager"
        ? "Store Manager"
        : user?.role === "staff"
          ? "Staff"
          : "Admin";

  return (
    <header className="fixed top-0 left-0 right-0 h-[58px] bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-serif font-bold text-primary tracking-tight">
          Furnex<span className="text-foreground">.</span>
        </h1>
        <div className="h-4 w-px bg-gray-200 mx-2" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Management Console
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Simple Search Mockup */}
        <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary/20 transition-all">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-transparent border-none text-xs focus:ring-0 placeholder:text-muted-foreground/60 w-40"
          />
        </div>

        <button className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity focus:outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-muted-foreground">{roleName}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@furnex.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => logOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
