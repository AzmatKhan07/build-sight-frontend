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
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  Activity,
  Eye,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    project: "Project Alpha",
    time: "2 min ago",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    project: "Project Beta",
    time: "5 min ago",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    project: "Project Gamma",
    time: "8 min ago",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    project: "Project Alpha",
    time: "12 min ago",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800",
    project: "Project Delta",
    time: "15 min ago",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800",
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
    progress: 75,
    completion: "2024-12-15",
  },
  {
    id: 2,
    name: "Project Beta",
    client: "XYZ Builders",
    startDate: "2024-02-01",
    cameras: 8,
    status: "active",
    progress: 60,
    completion: "2024-11-30",
  },
  {
    id: 3,
    name: "Project Gamma",
    client: "DEF Developers",
    startDate: "2024-02-10",
    cameras: 15,
    status: "active",
    progress: 45,
    completion: "2025-01-20",
  },
  {
    id: 4,
    name: "Project Delta",
    client: "GHI Corp",
    startDate: "2024-02-20",
    cameras: 6,
    status: "active",
    progress: 30,
    completion: "2025-02-28",
  },
];

const alerts = [
  {
    id: 1,
    type: "warning",
    message: "Camera-001 went offline",
    time: "5 min ago",
    project: "Project Alpha",
  },
  {
    id: 2,
    type: "info",
    message: "New image captured from Project Alpha",
    time: "10 min ago",
    project: "Project Alpha",
  },
  {
    id: 3,
    type: "error",
    message: "Storage usage at 85%",
    time: "1 hour ago",
    project: "System",
  },
  {
    id: 4,
    type: "warning",
    message: "Camera-005 went offline",
    time: "2 hours ago",
    project: "Project Beta",
  },
];

const cameraStats = {
  online: 148,
  offline: 8,
  total: 156,
  uptime: 95,
};

// Modern Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendValue,
  change,
  iconBg,
  iconColor,
}) => {
  const isPositive = change === "up";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("rounded-lg p-3", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isPositive
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trendValue}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon: Icon, title, description, href }) => (
  <Card className="group cursor-pointer hover:shadow-md hover:border-primary/50 transition-all">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Modern Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your construction monitoring overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Clients"
          value={stats.totalClients}
          trend={true}
          trendValue="+12.5%"
          change="up"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={FolderKanban}
          title="Active Projects"
          value={stats.totalProjects}
          trend={true}
          trendValue="+8.2%"
          change="up"
          iconBg="bg-purple-500/10"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={Camera}
          title="Total Cameras"
          value={stats.totalCameras}
          trend={true}
          trendValue="+5.1%"
          change="up"
          iconBg="bg-green-500/10"
          iconColor="text-green-600"
        />
        <StatCard
          icon={ImageIcon}
          title="Images Today"
          value={stats.newImagesToday}
          trend={true}
          trendValue="+18.3%"
          change="up"
          iconBg="bg-orange-500/10"
          iconColor="text-orange-600"
        />
      </div>

      {/* Camera Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Camera Status Overview</CardTitle>
            <Badge variant="outline">{cameraStats.uptime}% Uptime</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Online Cameras</span>
                <span className="text-2xl font-bold text-green-600">
                  {cameraStats.online}
                </span>
              </div>
              <Progress
                value={(cameraStats.online / cameraStats.total) * 100}
                className="h-2"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offline Cameras</span>
                <span className="text-2xl font-bold text-red-600">
                  {cameraStats.offline}
                </span>
              </div>
              <Progress
                value={(cameraStats.offline / cameraStats.total) * 100}
                className="h-2 [&>div]:bg-red-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Cameras</span>
                <span className="text-2xl font-bold">{cameraStats.total}</span>
              </div>
              <Progress value={100} className="h-2 [&>div]:bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Captured Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest Captured Images</CardTitle>
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {latestImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-video rounded-xl bg-muted overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={image.url}
                    alt={`${image.project} - ${image.time}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-medium text-sm truncate">
                      {image.project}
                    </p>
                    <p className="text-xs text-white/80">{image.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
              <Badge variant="destructive" className="rounded-full">
                {stats.pendingAlerts}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-accent/50",
                    alert.type === "error" &&
                      "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20",
                    alert.type === "warning" &&
                      "border-orange-200 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-950/20",
                    alert.type === "info" &&
                      "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full p-1.5 shrink-0",
                      alert.type === "error" && "bg-red-500/10",
                      alert.type === "warning" && "bg-orange-500/10",
                      alert.type === "info" && "bg-blue-500/10"
                    )}
                  >
                    <AlertCircle
                      className={cn(
                        "h-4 w-4",
                        alert.type === "error" && "text-red-600",
                        alert.type === "warning" && "text-orange-600",
                        alert.type === "info" && "text-blue-600"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-tight">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.project}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-primary hover:underline w-full text-center flex items-center justify-center gap-1">
              View All Alerts
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View All Projects
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <Badge variant="outline" className="rounded-full">
                      <Camera className="h-3 w-3 mr-1" />
                      {project.cameras}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.client}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className="rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20">
                    Active
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(project.completion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          icon={Camera}
          title="Add Camera"
          description="Register a new camera to a project"
          href="/admin/cameras/create"
        />
        <QuickActionCard
          icon={FolderKanban}
          title="New Project"
          description="Start monitoring a new project"
          href="/admin/projects/create"
        />
        <QuickActionCard
          icon={ImageIcon}
          title="Compare Images"
          description="Compare construction progress"
          href="/admin/compare"
        />
        <QuickActionCard
          icon={Activity}
          title="Time-Lapse"
          description="Generate time-lapse videos"
          href="/admin/timelapse"
        />
      </div>
    </div>
  );
}
