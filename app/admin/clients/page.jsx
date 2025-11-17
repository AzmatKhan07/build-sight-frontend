"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data
const mockClients = [
  {
    id: 1,
    logo: "https://via.placeholder.com/40",
    name: "ABC Construction",
    projects: 5,
    status: "active",
    email: "contact@abcconstruction.com",
    phone: "+1 234-567-8900",
  },
  {
    id: 2,
    logo: "https://via.placeholder.com/40",
    name: "XYZ Builders",
    projects: 3,
    status: "active",
    email: "info@xyzbuilders.com",
    phone: "+1 234-567-8901",
  },
  {
    id: 3,
    logo: "https://via.placeholder.com/40",
    name: "DEF Developers",
    projects: 8,
    status: "active",
    email: "hello@defdevelopers.com",
    phone: "+1 234-567-8902",
  },
  {
    id: 4,
    logo: "https://via.placeholder.com/40",
    name: "GHI Corp",
    projects: 2,
    status: "inactive",
    email: "contact@ghicorp.com",
    phone: "+1 234-567-8903",
  },
  {
    id: 5,
    logo: "https://via.placeholder.com/40",
    name: "JKL Industries",
    projects: 6,
    status: "active",
    email: "info@jklindustries.com",
    phone: "+1 234-567-8904",
  },
];

const mockProjects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
  { id: 4, name: "Project Delta" },
  { id: 5, name: "Project Epsilon" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    description: "",
    assignedProjects: [],
    logo: null,
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate clients
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        address: client.address || "",
        email: client.email,
        phone: client.phone,
        description: client.description || "",
        assignedProjects: client.assignedProjects || [],
        logo: client.logo,
      });
      setLogoPreview(client.logo);
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        description: "",
        assignedProjects: [],
        logo: null,
      });
      setLogoPreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
      description: "",
      assignedProjects: [],
      logo: null,
    });
    setLogoPreview(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData({ ...formData, logo: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData({ ...formData, logo: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      // Update client
      setClients(
        clients.map((client) =>
          client.id === editingClient.id
            ? {
                ...client,
                ...formData,
                logo: logoPreview || client.logo,
              }
            : client
        )
      );
    } else {
      // Add new client
      const newClient = {
        id: clients.length + 1,
        ...formData,
        logo: logoPreview || "https://via.placeholder.com/40",
        status: "active",
        projects: formData.assignedProjects.length,
      };
      setClients([...clients, newClient]);
    }
    handleCloseDialog();
  };

  const handleDelete = (clientId) => {
    if (confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((client) => client.id !== clientId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your clients and their information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 size-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Edit Client" : "Add New Client"}
              </DialogTitle>
              <DialogDescription>
                {editingClient
                  ? "Update client information below."
                  : "Fill in the details to add a new client."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <Avatar className="size-20 rounded-lg">
                        <AvatarImage
                          src={logoPreview}
                          alt="Logo preview"
                          className="rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg">
                          {formData.name
                            ? formData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "LO"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 size-6 rounded-full"
                        onClick={handleRemoveLogo}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <Avatar className="size-20 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        <Upload className="size-6 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a logo (max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              {/* Assigned Projects */}
              <div className="space-y-2">
                <Label>Assigned Projects</Label>
                <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                  {mockProjects.length > 0 ? (
                    <div className="space-y-2">
                      {mockProjects.map((project) => {
                        const isSelected = formData.assignedProjects.includes(
                          project.id.toString()
                        );
                        return (
                          <label
                            key={project.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    assignedProjects: [
                                      ...formData.assignedProjects,
                                      project.id.toString(),
                                    ],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    assignedProjects:
                                      formData.assignedProjects.filter(
                                        (id) => id !== project.id.toString()
                                      ),
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{project.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No projects available
                    </p>
                  )}
                </div>
                {formData.assignedProjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.assignedProjects.map((projectId) => {
                      const project = mockProjects.find(
                        (p) => p.id.toString() === projectId
                      );
                      return project ? (
                        <Badge
                          key={projectId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {project.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                assignedProjects:
                                  formData.assignedProjects.filter(
                                    (id) => id !== projectId
                                  ),
                              });
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClient ? "Update" : "Create"} Client
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Avatar className="size-10 rounded-lg">
                        <AvatarImage
                          src={client.logo}
                          alt={client.name}
                          className="rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.projects}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.status === "active" ? "success" : "secondary"
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(client)}
                          >
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(client.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No clients found. Try adjusting your search or filters.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} clients
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
                    variant={currentPage === page ? "default" : "outline"}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
