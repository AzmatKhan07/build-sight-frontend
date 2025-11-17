"use client";

import React from "react";
import {
  Users,
  FolderKanban,
  Camera,
  CameraOff,
  Bell,
  Image as ImageIcon,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data
const stats = {
  totalClients: 24,
  totalProjects: 48,
  totalCameras: 156,
  camerasOffline: 8,
  pendingAlerts: 12,
  newImagesToday: 1247,
};

const latestImages = [
  {
    id: 1,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Alpha",
    time: "2 min ago",
  },
  {
    id: 2,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Beta",
    time: "5 min ago",
  },
  {
    id: 3,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Gamma",
    time: "8 min ago",
  },
  {
    id: 4,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Alpha",
    time: "12 min ago",
  },
  {
    id: 5,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Delta",
    time: "15 min ago",
  },
  {
    id: 6,
    url: "https://thumbs.dreamstime.com/b/ai-security-camera-mounted-wall-digital-data-streams-modern-tech-cctv-video-surveillance-system-smart-wireless-monitoring-387039896.jpg",
    project: "Project Beta",
    time: "18 min ago",
  },
];

const activeProjects = [
  {
    id: 1,
    name: "Project Alpha",
    client: "ABC Construction",
    startDate: "2024-01-15",
    cameras: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Project Beta",
    client: "XYZ Builders",
    startDate: "2024-02-01",
    cameras: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Project Gamma",
    client: "DEF Developers",
    startDate: "2024-02-10",
    cameras: 15,
    status: "active",
  },
  {
    id: 4,
    name: "Project Delta",
    client: "GHI Corp",
    startDate: "2024-02-20",
    cameras: 6,
    status: "active",
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Camera-001 went offline",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "info",
    message: "New image captured from Project Alpha",
    time: "10 min ago",
  },
  { id: 3, type: "error", message: "Storage usage at 85%", time: "1 hour ago" },
  {
    id: 4,
    type: "warning",
    message: "Camera-005 went offline",
    time: "2 hours ago",
  },
];

// Mock chart data for camera status
const cameraStatusData = [
  { day: "Mon", online: 148, offline: 8 },
  { day: "Tue", online: 150, offline: 6 },
  { day: "Wed", online: 152, offline: 4 },
  { day: "Thu", online: 151, offline: 5 },
  { day: "Fri", online: 149, offline: 7 },
  { day: "Sat", online: 148, offline: 8 },
  { day: "Sun", online: 150, offline: 6 },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendValue,
  className,
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <TrendingUp className="size-3" />
          {trendValue} from last week
        </p>
      )}
    </CardContent>
  </Card>
);

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          title="Total Clients"
          value={stats.totalClients}
          trend={true}
          trendValue="+3"
        />
        <StatCard
          icon={FolderKanban}
          title="Total Projects"
          value={stats.totalProjects}
          trend={true}
          trendValue="+5"
        />
        <StatCard
          icon={Camera}
          title="Total Cameras"
          value={stats.totalCameras}
        />
        <StatCard
          icon={CameraOff}
          title="Cameras Offline"
          value={stats.camerasOffline}
          className="border-destructive/50"
        />
        <StatCard
          icon={Bell}
          title="Pending Alerts"
          value={stats.pendingAlerts}
          className="border-orange-500/50"
        />
        <StatCard
          icon={ImageIcon}
          title="New Images Today"
          value={stats.newImagesToday}
          trend={true}
          trendValue="+12%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Captured Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Captured Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {latestImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-video rounded-lg bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={image.url}
                    alt={`${image.project} - ${image.time}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs">
                    <p className="font-medium truncate">{image.project}</p>
                    <p className="text-white/80">{image.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-primary hover:underline">
              View All Images →
            </button>
          </CardContent>
        </Card>

        {/* Alerts Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border",
                    alert.type === "error" &&
                      "border-destructive/50 bg-destructive/5",
                    alert.type === "warning" &&
                      "border-orange-500/50 bg-orange-500/5",
                    alert.type === "info" && "border-blue-500/50 bg-blue-500/5"
                  )}
                >
                  <AlertCircle
                    className={cn(
                      "size-4 mt-0.5 shrink-0",
                      alert.type === "error" && "text-destructive",
                      alert.type === "warning" && "text-orange-500",
                      alert.type === "info" && "text-blue-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-primary hover:underline w-full text-center">
              View All Alerts →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Project Name
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Start Date
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Cameras
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b hover:bg-accent/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium">{project.name}</div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {project.client}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm">{project.cameras}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
