"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Calendar,
  Camera,
  HardDrive,
  AlertCircle,
  Clock,
  Video,
  Play,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Mock data
const mockProjects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    client: "ABC Corporation",
    clientId: 1,
    description:
      "Construction monitoring for new office building. This project involves monitoring the construction of a 20-story office complex in the downtown area.",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    status: "active",
    camerasCount: 8,
    storageUsed: "2.4 TB",
    cameras: [
      { id: 1, name: "Camera 001", status: "online", lastImage: "2024-03-15T10:30:00" },
      { id: 2, name: "Camera 002", status: "online", lastImage: "2024-03-15T10:29:00" },
      { id: 3, name: "Camera 003", status: "offline", lastImage: "2024-03-15T09:15:00" },
      { id: 4, name: "Camera 004", status: "online", lastImage: "2024-03-15T10:28:00" },
    ],
    recentImages: [
      { id: 1, url: "", camera: "Camera 001", timestamp: "2024-03-15T10:30:00" },
      { id: 2, url: "", camera: "Camera 002", timestamp: "2024-03-15T10:29:00" },
      { id: 3, url: "", camera: "Camera 004", timestamp: "2024-03-15T10:28:00" },
      { id: 4, url: "", camera: "Camera 001", timestamp: "2024-03-15T10:27:00" },
      { id: 5, url: "", camera: "Camera 002", timestamp: "2024-03-15T10:26:00" },
    ],
    alerts: [
      {
        id: 1,
        type: "motion",
        message: "Motion detected at Camera 001",
        timestamp: "2024-03-15T10:30:00",
        status: "new",
      },
      {
        id: 2,
        type: "offline",
        message: "Camera 003 went offline",
        timestamp: "2024-03-15T09:15:00",
        status: "acknowledged",
      },
      {
        id: 3,
        type: "motion",
        message: "Motion detected at Camera 002",
        timestamp: "2024-03-15T08:45:00",
        status: "resolved",
      },
    ],
    timelapseVideos: [
      { id: 1, name: "Week 1 Timelapse", date: "2024-01-22", duration: "2:30" },
      { id: 2, name: "Week 2 Timelapse", date: "2024-01-29", duration: "3:15" },
      { id: 3, name: "Week 3 Timelapse", date: "2024-02-05", duration: "2:45" },
    ],
  },
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const foundProject = mockProjects.find((p) => p.id === projectId);
    setProject(foundProject);
  }, [projectId]);

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-500/10 text-green-700 dark:text-green-400",
      completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      "on-hold": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    };
    return (
      <Badge variant="outline" className={colors[status] || ""}>
        {status === "active"
          ? "Active"
          : status === "completed"
          ? "Completed"
          : "On Hold"}
      </Badge>
    );
  };

  const getAlertTypeBadge = (type) => {
    const colors = {
      motion: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      offline: "bg-red-500/10 text-red-700 dark:text-red-400",
      alert: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    };
    return (
      <Badge variant="outline" className={colors[type] || ""}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getAlertStatusBadge = (status) => {
    const colors = {
      new: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      acknowledged: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      resolved: "bg-green-500/10 text-green-700 dark:text-green-400",
    };
    return (
      <Badge variant="outline" className={colors[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      router.push("/admin/projects");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {getStatusBadge(project.status)}
          </div>
          <p className="text-muted-foreground mt-1">
            Project details and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${projectId}/edit`}>
            <Button>
              <Edit className="mr-2 size-4" />
              Edit Project
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Client</p>
              <p className="font-medium">{project.client}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Cameras</p>
              <div className="flex items-center gap-2">
                <Camera className="size-4 text-muted-foreground" />
                <p className="font-medium">{project.camerasCount}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <p className="font-medium">{formatDate(project.startDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">End Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <p className="font-medium">{formatDate(project.endDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Storage Used</p>
              <div className="flex items-center gap-2">
                <HardDrive className="size-4 text-muted-foreground" />
                <p className="font-medium">{project.storageUsed}</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{project.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Cameras */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Cameras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Camera Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.cameras.map((camera) => (
                  <TableRow key={camera.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Camera className="size-4 text-muted-foreground" />
                        <span className="font-medium">{camera.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={camera.status === "online" ? "default" : "secondary"}
                        className={
                          camera.status === "online"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }
                      >
                        {camera.status === "online" ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3" />
                        <span className="text-sm">
                          {formatDateTime(camera.lastImage)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/cameras/${camera.id}`}>
                        <Button variant="ghost" size="sm">
                          View Camera
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Images Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Images Timeline</CardTitle>
            <Button variant="outline" size="sm">
              Filter by Date
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {project.recentImages.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-48 space-y-2"
              >
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={image.camera}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{image.camera}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(image.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getAlertTypeBadge(alert.type)}
                    {getAlertStatusBadge(alert.status)}
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDateTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timelapse Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timelapse Videos</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Video className="mr-2 size-4" />
                Generate Timelapse
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {project.timelapseVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.timelapseVideos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="size-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{video.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {video.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(video.date)}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="mr-2 size-3" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Video className="size-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No timelapse videos generated yet
              </p>
              <Button variant="outline">
                <Video className="mr-2 size-4" />
                Generate First Timelapse
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

