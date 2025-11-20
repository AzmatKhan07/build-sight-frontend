"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Loader2,
  AlertCircle,
  Calendar,
  Camera,
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
const mockProjects = [
  {
    id: 1,
    name: "Downtown Office Complex",
    client: "ABC Corporation",
    clientId: 1,
    description: "Construction monitoring for new office building",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    status: "active",
    camerasCount: 8,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Residential Tower Project",
    client: "XYZ Developers",
    clientId: 2,
    description: "24/7 monitoring of residential construction",
    startDate: "2024-02-01",
    endDate: "2025-06-30",
    status: "active",
    camerasCount: 12,
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    name: "Shopping Mall Expansion",
    client: "ABC Corporation",
    clientId: 1,
    description: "Monitoring expansion work",
    startDate: "2023-11-01",
    endDate: "2024-03-15",
    status: "completed",
    camerasCount: 6,
    createdAt: "2023-10-20",
  },
  {
    id: 4,
    name: "Highway Bridge Construction",
    client: "Infrastructure Co.",
    clientId: 3,
    description: "Safety monitoring for bridge construction",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    status: "active",
    camerasCount: 15,
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    name: "Warehouse Renovation",
    client: "XYZ Developers",
    clientId: 2,
    description: "Renovation project monitoring",
    startDate: "2024-01-20",
    endDate: "2024-05-20",
    status: "on-hold",
    camerasCount: 4,
    createdAt: "2024-01-15",
  },
];

const mockClients = [
  { id: 1, name: "ABC Corporation" },
  { id: 2, name: "XYZ Developers" },
  { id: 3, name: "Infrastructure Co." },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Client filter
    if (clientFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.clientId === parseInt(clientFilter)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchQuery, clientFilter, statusFilter]);

  // Paginate projects
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredProjects?.length || 0) / itemsPerPage);
  }, [filteredProjects, itemsPerPage]);

  const handleDelete = (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor construction projects
          </p>
        </div>
        <Link href="/admin/projects/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Add New Project
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
                placeholder="Search by project name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
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

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
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
          ) : paginatedProjects.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Cameras</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FolderKanban className="size-4 text-muted-foreground" />
                            <span className="font-medium">{project.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            {formatDate(project.startDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            {formatDate(project.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Camera className="size-3 text-muted-foreground" />
                            <span>{project.camerasCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/projects/${project.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="size-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(project.id)}
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
                      filteredProjects.length
                    )}{" "}
                    of {filteredProjects.length} projects
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
              <FolderKanban className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || clientFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating a new project"}
              </p>
              <Link href="/admin/projects/create">
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
