"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Loader2,
  AlertCircle,
  Camera,
  Upload,
  X as XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data
const mockClients = [
  { id: 1, name: "ABC Corporation" },
  { id: 2, name: "XYZ Developers" },
  { id: 3, name: "Infrastructure Co." },
];

const mockCameras = [
  { id: 1, name: "Camera 001", location: "Main Entrance" },
  { id: 2, name: "Camera 002", location: "Building A" },
  { id: 3, name: "Camera 003", location: "Building B" },
  { id: 4, name: "Camera 004", location: "Parking Lot" },
  { id: 5, name: "Camera 005", location: "Construction Site" },
  { id: 6, name: "Camera 006", location: "Storage Area" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active",
    cameras: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedCameras, setSelectedCameras] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleCameraToggle = (cameraId) => {
    setSelectedCameras((prev) => {
      if (prev.includes(cameraId)) {
        return prev.filter((id) => id !== cameraId);
      } else {
        return [...prev, cameraId];
      }
    });
  };

  const removeCamera = (cameraId) => {
    setSelectedCameras((prev) => prev.filter((id) => id !== cameraId));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    }

    if (!formData.clientId) {
      errors.clientId = "Client is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        errors.endDate = "End date must be after start date";
      }
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
      setIsSubmitting(false);
      // Navigate back to projects list
      router.push("/admin/projects");
    }, 1000);
  };

  const getSelectedCameraNames = () => {
    return selectedCameras
      .map((id) => {
        const camera = mockCameras.find((c) => c.id === id);
        return camera ? camera.name : null;
      })
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-1">
            Add a new construction project to monitor
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Downtown Office Complex"
                required
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">
                Client <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleInputChange("clientId", value)}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.clientId && (
                <p className="text-sm text-destructive">
                  {formErrors.clientId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter project description..."
                rows={4}
                required
              />
              {formErrors.description && (
                <p className="text-sm text-destructive">
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  required
                />
                {formErrors.startDate && (
                  <p className="text-sm text-destructive">
                    {formErrors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
                {formErrors.endDate && (
                  <p className="text-sm text-destructive">
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
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

        {/* Camera Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Camera Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Cameras</Label>
              <Select
                onValueChange={(value) => {
                  const cameraId = parseInt(value);
                  if (!selectedCameras.includes(cameraId)) {
                    handleCameraToggle(cameraId);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add a camera" />
                </SelectTrigger>
                <SelectContent>
                  {mockCameras
                    .filter((camera) => !selectedCameras.includes(camera.id))
                    .map((camera) => (
                      <SelectItem key={camera.id} value={camera.id.toString()}>
                        {camera.name} - {camera.location}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCameras.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Cameras</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCameras.map((cameraId) => {
                    const camera = mockCameras.find((c) => c.id === cameraId);
                    return camera ? (
                      <Badge
                        key={cameraId}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <Camera className="size-3" />
                        {camera.name}
                        <button
                          type="button"
                          onClick={() => removeCamera(cameraId)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/projects">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
