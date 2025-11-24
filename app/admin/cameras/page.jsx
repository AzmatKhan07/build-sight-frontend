"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Camera,
  Loader2,
  AlertCircle,
  HardDrive,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    lastCaptured: "2024-03-15T10:30:00",
    storageUsed: "2.4 GB",
    lastImageUrl: "",
  },
  {
    id: 2,
    name: "Camera 002",
    cameraId: "CAM-002",
    project: "Downtown Office Complex",
    projectId: 1,
    status: "online",
    lastCaptured: "2024-03-15T10:29:00",
    storageUsed: "1.8 GB",
    lastImageUrl: "",
  },
  {
    id: 3,
    name: "Camera 003",
    cameraId: "CAM-003",
    project: "Residential Tower Project",
    projectId: 2,
    status: "offline",
    lastCaptured: "2024-03-15T09:15:00",
    storageUsed: "3.2 GB",
    lastImageUrl: "",
  },
  {
    id: 4,
    name: "Camera 004",
    cameraId: "CAM-004",
    project: "Residential Tower Project",
    projectId: 2,
    status: "online",
    lastCaptured: "2024-03-15T10:28:00",
    storageUsed: "2.1 GB",
    lastImageUrl: "",
  },
  {
    id: 5,
    name: "Camera 005",
    cameraId: "CAM-005",
    project: "Shopping Mall Expansion",
    projectId: 3,
    status: "online",
    lastCaptured: "2024-03-15T10:27:00",
    storageUsed: "1.5 GB",
    lastImageUrl: "",
  },
  {
    id: 6,
    name: "Camera 006",
    cameraId: "CAM-006",
    project: "Highway Bridge Construction",
    projectId: 4,
    status: "offline",
    lastCaptured: "2024-03-14T18:00:00",
    storageUsed: "4.2 GB",
    lastImageUrl: "",
  },
];

const mockProjects = [
  { id: 1, name: "Downtown Office Complex" },
  { id: 2, name: "Residential Tower Project" },
  { id: 3, name: "Shopping Mall Expansion" },
  { id: 4, name: "Highway Bridge Construction" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

export default function CamerasPage() {
  const [cameras, setCameras] = useState(mockCameras);
  const [filteredCameras, setFilteredCameras] = useState(mockCameras);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  // Filter cameras
  useEffect(() => {
    let filtered = cameras;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (camera) =>
          camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          camera.cameraId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(
        (camera) => camera.projectId === parseInt(projectFilter)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((camera) => camera.status === statusFilter);
    }

    setFilteredCameras(filtered);
    setCurrentPage(1);
  }, [cameras, searchQuery, projectFilter, statusFilter]);

  // Paginate cameras
  const paginatedCameras = useMemo(() => {
    return filteredCameras.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredCameras, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredCameras?.length || 0) / itemsPerPage);
  }, [filteredCameras, itemsPerPage]);

  const handleDelete = (cameraId) => {
    if (confirm("Are you sure you want to delete this camera?")) {
      setCameras(cameras.filter((camera) => camera.id !== cameraId));
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cameras</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor CCTV cameras
          </p>
        </div>
        <Link href="/admin/cameras/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Add New Camera
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by camera name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cameras Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cameras ({filteredCameras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="size-12 text-destructive mb-4" />
              <p className="text-destructive font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setError("")}
              >
                Try Again
              </Button>
            </div>
          ) : paginatedCameras.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Camera Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Captured Image</TableHead>
                      <TableHead>Storage Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Camera className="size-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{camera.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {camera.cameraId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{camera.project}</TableCell>
                        <TableCell>{getStatusBadge(camera.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-12 bg-muted rounded overflow-hidden">
                              <img
                                src={
                                  camera.lastImageUrl ||
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='75'%3E%3Crect fill='%23ddd' width='100' height='75'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                                }
                                alt="Last captured"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='75'%3E%3Crect fill='%23ddd' width='100' height='75'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(camera.lastCaptured)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <HardDrive className="size-3 text-muted-foreground" />
                            <span className="text-sm">
                              {camera.storageUsed}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/cameras/${camera.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/cameras/${camera.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="size-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(camera.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredCameras.length
                    )}{" "}
                    of {filteredCameras.length} cameras
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Camera className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No cameras found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ||
                projectFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding a new camera"}
              </p>
              <Link href="/admin/cameras/create">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Add Camera
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
