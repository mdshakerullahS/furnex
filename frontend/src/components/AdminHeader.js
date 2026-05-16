"use client";

import { Bell, Search } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[58px] bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-serif font-bold text-primary tracking-tight">
          Furniro<span className="text-foreground">.</span>
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

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">Admin User</p>
            <p className="text-[10px] text-muted-foreground">System Access</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
