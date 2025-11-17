"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock notifications
  const notifications = [
    { id: 1, message: "Camera offline: Camera-001", time: "5 min ago" },
    {
      id: 2,
      message: "New image captured from Project Alpha",
      time: "10 min ago",
    },
    { id: 3, message: "Storage usage at 85%", time: "1 hour ago" },
  ];

  return (
    <header className="flex w-full h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input type="search" placeholder="Search..." className="pl-10" />
        </div>
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex size-2 rounded-full bg-destructive" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="flex flex-col items-start p-4 cursor-pointer"
                  onSelect={() => {}}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.time}
                  </p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
      )}
    </header>
  );
}
