"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Mock data
const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    permissions: [
      "users.create",
      "users.edit",
      "users.delete",
      "users.view",
      "clients.create",
      "clients.edit",
      "clients.delete",
      "clients.view",
      "projects.create",
      "projects.edit",
      "projects.delete",
      "projects.view",
      "cameras.create",
      "cameras.edit",
      "cameras.delete",
      "cameras.view",
      "reports.view",
      "reports.generate",
      "alerts.view",
      "alerts.manage",
      "object-detection.view",
      "object-detection.manage",
    ],
    usersCount: 2,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Manager",
    permissions: [
      "users.view",
      "clients.create",
      "clients.edit",
      "clients.view",
      "projects.create",
      "projects.edit",
      "projects.view",
      "cameras.view",
      "reports.view",
      "reports.generate",
      "alerts.view",
    ],
    usersCount: 5,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "Viewer",
    permissions: [
      "users.view",
      "clients.view",
      "projects.view",
      "cameras.view",
      "reports.view",
    ],
    usersCount: 12,
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Editor",
    permissions: [
      "users.view",
      "clients.create",
      "clients.edit",
      "clients.view",
      "projects.create",
      "projects.edit",
      "projects.view",
      "cameras.view",
      "reports.view",
    ],
    usersCount: 8,
    createdAt: "2024-02-10",
  },
];

// Permission groups structure
const permissionGroups = [
  {
    group: "Users Management",
    permissions: [
      { id: "users.create", label: "Create User" },
      { id: "users.edit", label: "Edit User" },
      { id: "users.delete", label: "Delete User" },
      { id: "users.view", label: "View Users" },
    ],
  },
  {
    group: "Clients Management",
    permissions: [
      { id: "clients.create", label: "Create Client" },
      { id: "clients.edit", label: "Edit Client" },
      { id: "clients.delete", label: "Delete Client" },
      { id: "clients.view", label: "View Clients" },
    ],
  },
  {
    group: "Projects Management",
    permissions: [
      { id: "projects.create", label: "Create Project" },
      { id: "projects.edit", label: "Edit Project" },
      { id: "projects.delete", label: "Delete Project" },
      { id: "projects.view", label: "View Projects" },
    ],
  },
  {
    group: "Cameras Management",
    permissions: [
      { id: "cameras.create", label: "Create Camera" },
      { id: "cameras.edit", label: "Edit Camera" },
      { id: "cameras.delete", label: "Delete Camera" },
      { id: "cameras.view", label: "View Cameras" },
    ],
  },
  {
    group: "Reports",
    permissions: [
      { id: "reports.view", label: "View Reports" },
      { id: "reports.generate", label: "Generate Reports" },
      { id: "reports.export", label: "Export Reports" },
    ],
  },
  {
    group: "Alerts",
    permissions: [
      { id: "alerts.view", label: "View Alerts" },
      { id: "alerts.manage", label: "Manage Alerts" },
    ],
  },
  {
    group: "Object Detection",
    permissions: [
      { id: "object-detection.view", label: "View Object Detection" },
      { id: "object-detection.manage", label: "Manage Object Detection" },
    ],
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles);
  const [filteredRoles, setFilteredRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 10;

  // Filter roles
  useEffect(() => {
    let filtered = roles || [];

    if (searchQuery) {
      filtered = filtered.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRoles(filtered);
    setCurrentPage(1);
  }, [roles, searchQuery]);

  // Paginate roles
  const paginatedRoles = useMemo(() => {
    return (filteredRoles || []).slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredRoles, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredRoles?.length || 0) / itemsPerPage);
  }, [filteredRoles, itemsPerPage]);

  const handleOpenDialog = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: role.permissions,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        permissions: [],
      });
    }
    setFormErrors({});
    setError("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    setFormData({
      name: "",
      permissions: [],
    });
    setFormErrors({});
    setError("");
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions };
    });
  };

  const handleSelectAllInGroup = (groupPermissions) => {
    const groupPermissionIds = groupPermissions.map((p) => p.id);
    const allSelected = groupPermissionIds.every((id) =>
      formData.permissions.includes(id)
    );

    setFormData((prev) => {
      if (allSelected) {
        // Deselect all in group
        return {
          ...prev,
          permissions: prev.permissions.filter(
            (id) => !groupPermissionIds.includes(id)
          ),
        };
      } else {
        // Select all in group
        const newPermissions = [...prev.permissions];
        groupPermissionIds.forEach((id) => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return { ...prev, permissions: newPermissions };
      }
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Role name is required";
    }

    if (formData.permissions.length === 0) {
      errors.permissions = "At least one permission must be selected";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (editingRole) {
        // Update role
        setRoles(
          roles.map((role) =>
            role.id === editingRole.id
              ? {
                  ...role,
                  name: formData.name,
                  permissions: formData.permissions,
                }
              : role
          )
        );
      } else {
        // Add new role
        const newRole = {
          id: roles.length + 1,
          name: formData.name,
          permissions: formData.permissions,
          usersCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setRoles([...roles, newRole]);
      }

      setIsSubmitting(false);
      handleCloseDialog();
    }, 1000);
  };

  const handleDelete = (roleId) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((role) => role.id !== roleId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPermissionLabel = (permissionId) => {
    for (const group of permissionGroups) {
      const permission = group.permissions.find((p) => p.id === permissionId);
      if (permission) return permission.label;
    }
    return permissionId;
  };

  const getPermissionGroup = (permissionId) => {
    for (const group of permissionGroups) {
      if (group.permissions.some((p) => p.id === permissionId)) {
        return group.group;
      }
    }
    return "Other";
  };

  // Group permissions by their group for display
  const groupPermissionsForDisplay = (permissionIds) => {
    const grouped = {};
    permissionIds.forEach((id) => {
      const group = getPermissionGroup(id);
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(id);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 size-4" />
              Add New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Edit Role" : "Add New Role"}
              </DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Update role information and permissions below."
                  : "Fill in the details to create a new role."}
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name)
                      setFormErrors({ ...formErrors, name: "" });
                  }}
                  required
                  placeholder="e.g., Manager, Viewer, Editor"
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              {/* Permissions Section */}
              <div className="space-y-2">
                <Label>Permissions *</Label>
                {formErrors.permissions && (
                  <p className="text-sm text-destructive">
                    {formErrors.permissions}
                  </p>
                )}
                <Accordion type="multiple" className="w-full">
                  {permissionGroups.map((group) => {
                    const groupPermissionIds = group.permissions.map(
                      (p) => p.id
                    );
                    const selectedInGroup = groupPermissionIds.filter((id) =>
                      formData.permissions.includes(id)
                    );
                    const allSelected =
                      selectedInGroup.length === groupPermissionIds.length;

                    return (
                      <AccordionItem key={group.group} value={group.group}>
                        <AccordionTrigger>
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">{group.group}</span>
                            <Badge variant="secondary" className="mr-2">
                              {selectedInGroup.length}/
                              {groupPermissionIds.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-4">
                            <div className="flex items-center space-x-2 pb-2 border-b">
                              <Checkbox
                                id={`select-all-${group.group}`}
                                checked={allSelected}
                                onCheckedChange={() =>
                                  handleSelectAllInGroup(group.permissions)
                                }
                              />
                              <Label
                                htmlFor={`select-all-${group.group}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                Select All
                              </Label>
                            </div>
                            <div className="space-y-2">
                              {group.permissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={permission.id}
                                    checked={formData.permissions.includes(
                                      permission.id
                                    )}
                                    onCheckedChange={() =>
                                      handlePermissionToggle(permission.id)
                                    }
                                  />
                                  <Label
                                    htmlFor={permission.id}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {permission.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by role name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
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
          ) : paginatedRoles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedRoles.map((role) => {
                  const groupedPermissions = groupPermissionsForDisplay(
                    role.permissions
                  );
                  return (
                    <Card key={role.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="size-5 text-primary" />
                            <CardTitle className="text-lg">
                              {role.name}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(role)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(role.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Permissions
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(groupedPermissions).map(
                              ([group, permissions]) => (
                                <Badge
                                  key={group}
                                  className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                >
                                  {group} ({permissions.length})
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Users
                            </p>
                            <p className="text-sm font-medium">
                              {role.usersCount}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Created
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(role.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredRoles.length)}{" "}
                    of {filteredRoles.length} roles
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
              <Shield className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No roles created yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating a new role"}
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 size-4" />
                Create Role
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
