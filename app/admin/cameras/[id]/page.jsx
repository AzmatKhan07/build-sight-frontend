"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Camera,
  Clock,
  RefreshCw,
  PowerOff,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Mock data
const mockCameras = [
  {
    id: 1,
    name: "Camera 001",
    cameraId: "CAM-001",
    project: "Downtown Office Complex",
    projectId: 1,
    status: "online",
    url: "http://192.168.1.100:8080",
    captureInterval: 60,
    lastOnline: "2024-03-15T10:30:00",
    storageUsed: 20,
    storageTotal: 100,
    lastImageUrl: "",
    lastImageTimestamp: "2024-03-15T10:30:00",
    recentImages: [
      { id: 1, url: "", timestamp: "2024-03-15T10:30:00" },
      { id: 2, url: "", timestamp: "2024-03-15T10:29:00" },
      { id: 3, url: "", timestamp: "2024-03-15T10:28:00" },
      { id: 4, url: "", timestamp: "2024-03-15T10:27:00" },
      { id: 5, url: "", timestamp: "2024-03-15T10:26:00" },
      { id: 6, url: "", timestamp: "2024-03-15T10:25:00" },
      { id: 7, url: "", timestamp: "2024-03-15T10:24:00" },
      { id: 8, url: "", timestamp: "2024-03-15T10:23:00" },
    ],
    alerts: [
      {
        id: 1,
        type: "offline",
        message: "Camera went offline",
        timestamp: "2024-03-15T09:15:00",
        status: "resolved",
      },
      {
        id: 2,
        type: "error",
        message: "Failed to capture image",
        timestamp: "2024-03-15T08:45:00",
        status: "acknowledged",
      },
      {
        id: 3,
        type: "new",
        message: "New image captured",
        timestamp: "2024-03-15T10:30:00",
        status: "new",
      },
    ],
  },
];

export default function CameraDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = parseInt(params.id);
  const [camera, setCamera] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const foundCamera = mockCameras.find((c) => c.id === cameraId);
    setCamera(foundCamera);
  }, [cameraId]);

  if (!camera) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Camera not found</p>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    return (
      <Badge
        variant={status === "online" ? "default" : "secondary"}
        className={
          status === "online"
            ? "bg-green-500/10 text-green-700 dark:text-green-400"
            : "bg-red-500/10 text-red-700 dark:text-red-400"
        }
      >
        {status === "online" ? "Online" : "Offline"}
      </Badge>
    );
  };

  const getAlertTypeBadge = (type) => {
    const colors = {
      offline: "bg-red-500/10 text-red-700 dark:text-red-400",
      error: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      new: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
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

  const handleRefreshImage = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCaptureNow = () => {
    // Mock action
    alert("Capturing image now...");
  };

  const handleRestartCamera = () => {
    if (confirm("Are you sure you want to restart this camera?")) {
      // Mock action
      alert("Restarting camera...");
    }
  };

  const handleDisableCamera = () => {
    if (confirm("Are you sure you want to disable this camera?")) {
      // Mock action
      alert("Disabling camera...");
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this camera?")) {
      router.push("/admin/cameras");
    }
  };

  const storagePercentage = (camera.storageUsed / camera.storageTotal) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{camera.name}</h1>
            {getStatusBadge(camera.status)}
          </div>
          <p className="text-muted-foreground mt-1">
            Camera ID: {camera.cameraId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/cameras/${cameraId}/edit`}>
            <Button>
              <Edit className="mr-2 size-4" />
              Edit Camera
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Camera Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Camera Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Camera Name</p>
              <p className="font-medium">{camera.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Camera ID</p>
              <p className="font-medium">{camera.cameraId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Assigned Project
              </p>
              <p className="font-medium">{camera.project}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Capture Interval
              </p>
              <p className="font-medium">{camera.captureInterval} seconds</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Last Online Time
              </p>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <p className="font-medium">
                  {formatDateTime(camera.lastOnline)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Camera URL</p>
              <p className="font-medium text-sm break-all">{camera.url}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Captured Image */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Last Captured Image</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshImage}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={
                  camera.lastImageUrl ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E"
                }
                alt="Last captured"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>{formatDateTime(camera.lastImageTimestamp)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-sm font-medium">
                  {camera.storageUsed} GB / {camera.storageTotal} GB
                </p>
              </div>
              <Progress value={storagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {storagePercentage.toFixed(1)}% used
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Images Stored
                </p>
                <p className="text-lg font-semibold">8,240</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Avg. Size
                </p>
                <p className="text-lg font-semibold">2.5 MB</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Retention
                </p>
                <p className="text-lg font-semibold">30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Images Gallery */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Images Gallery</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
                placeholder="Filter by date"
              />
              <Button variant="outline" size="sm">
                Load More
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {camera.recentImages.map((image) => (
              <div
                key={image.id}
                className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={
                      image.url ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%23ddd' width='200' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='12' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E"
                    }
                    alt={`Image ${image.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%23ddd' width='200' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='12' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(image.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Camera Timeline Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>Camera Timeline Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative h-24 bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-2 bg-background rounded-full relative">
                  {/* Timeline markers */}
                  {[0, 25, 50, 75, 100].map((position) => (
                    <div
                      key={position}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${position}%` }}
                    >
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <ChevronLeft className="size-4" />
                Previous Day
              </Button>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date().toISOString())}
              </p>
              <Button variant="outline" size="sm">
                Next Day
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Camera Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleCaptureNow}
            >
              <Camera className="mr-2 size-4" />
              Capture Image Now
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleRestartCamera}
            >
              <RefreshCw className="mr-2 size-4" />
              Restart Camera
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleDisableCamera}
            >
              <PowerOff className="mr-2 size-4" />
              Disable Camera
            </Button>
            <Link href={`/admin/timelapse?camera=${cameraId}`} className="block">
              <Button className="w-full justify-start" variant="outline">
                <Video className="mr-2 size-4" />
                Generate Timelapse
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {camera.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
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
      </div>
    </div>
  );
}

