"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  Camera,
  ImageIcon,
  Film,
  ScanSearch,
  FileText,
  Bell,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Clients", href: "/admin/clients" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Camera, label: "Cameras", href: "/admin/cameras" },
  { icon: ImageIcon, label: "Compare Images", href: "/admin/compare" },
  { icon: Film, label: "Timelapse", href: "/admin/timelapse" },
  {
    icon: ScanSearch,
    label: "Object Detection",
    href: "/admin/object-detection",
  },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: Bell, label: "Alerts Settings", href: "/admin/alerts" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Shield, label: "Roles", href: "/admin/roles" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">BuildSight</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-3 py-3 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-white" : "hover:bg-primary/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      isActive ? "text-white" : "text-primary"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="size-8">
                      <AvatarImage src="" alt="Admin User" />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Admin User</div>
                      <div className="text-xs text-muted-foreground">
                        admin@buildsight.com
                      </div>
                    </div>
                    <ChevronDown className="size-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    // Handle logout
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
