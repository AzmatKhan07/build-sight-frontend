"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

// Mock data
const mockProjects = [
  { id: 1, name: "Downtown Office Complex" },
  { id: 2, name: "Residential Tower Project" },
  { id: 3, name: "Shopping Mall Expansion" },
  { id: 4, name: "Highway Bridge Construction" },
];

export default function CreateCameraPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cameraId: "",
    projectId: "",
    url: "",
    captureInterval: 60,
    status: true,
    imageSize: 2.5,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      // Check if it's an IP address
      const ipRegex =
        /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;
      return ipRegex.test(url);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Camera name is required";
    }

    if (!formData.cameraId.trim()) {
      errors.cameraId = "Camera ID is required";
    }

    if (!formData.projectId) {
      errors.projectId = "Project is required";
    }

    if (!formData.url.trim()) {
      errors.url = "Camera URL/IP is required";
    } else if (!validateUrl(formData.url)) {
      errors.url = "Please enter a valid URL or IP address";
    }

    if (!formData.captureInterval || formData.captureInterval < 1) {
      errors.captureInterval = "Capture interval must be at least 1 second";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateStorage = () => {
    const imageSizeMB = formData.imageSize || 2.5;
    const intervalSeconds = formData.captureInterval || 60;
    const imagesPerDay = (24 * 60 * 60) / intervalSeconds;
    const storagePerDay = (imagesPerDay * imageSizeMB) / 1024; // GB
    const storagePerWeek = storagePerDay * 7;
    const storagePerMonth = storagePerDay * 30;

    return {
      perDay: storagePerDay.toFixed(2),
      perWeek: storagePerWeek.toFixed(2),
      perMonth: storagePerMonth.toFixed(2),
    };
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
      router.push("/admin/cameras");
    }, 1000);
  };

  const storage = calculateStorage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Camera</h1>
          <p className="text-muted-foreground mt-1">
            Add a new CCTV camera to monitor
          </p>
        </div>
        <Link href="/admin/cameras">
          <Button variant="outline">
            <X className="mr-2 size-4" />
            Cancel
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Camera Information */}
        <Card>
          <CardHeader>
            <CardTitle>Camera Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Camera Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Camera 001"
                required
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cameraId">
                Camera ID / Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cameraId"
                value={formData.cameraId}
                onChange={(e) => handleInputChange("cameraId", e.target.value)}
                placeholder="e.g., CAM-001"
                required
              />
              {formErrors.cameraId && (
                <p className="text-sm text-destructive">
                  {formErrors.cameraId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">
                Project <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  handleInputChange("projectId", value)
                }
              >
                <SelectTrigger id="projectId">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id.toString()}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.projectId && (
                <p className="text-sm text-destructive">
                  {formErrors.projectId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">
                Camera URL / IP Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="e.g., http://192.168.1.100:8080 or 192.168.1.100"
                required
              />
              {formErrors.url && (
                <p className="text-sm text-destructive">{formErrors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="captureInterval">
                Capture Interval (seconds){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="captureInterval"
                type="number"
                min="1"
                value={formData.captureInterval}
                onChange={(e) =>
                  handleInputChange(
                    "captureInterval",
                    parseInt(e.target.value) || 0
                  )
                }
                required
              />
              {formErrors.captureInterval && (
                <p className="text-sm text-destructive">
                  {formErrors.captureInterval}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                How often the camera should capture images (in seconds)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="status">Status</Label>
                <p className="text-xs text-muted-foreground">
                  Enable or disable the camera
                </p>
              </div>
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) =>
                  handleInputChange("status", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Storage Estimation */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Estimation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageSize">Average Image Size (MB)</Label>
              <Input
                id="imageSize"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.imageSize}
                onChange={(e) =>
                  handleInputChange(
                    "imageSize",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Storage per Day
                </p>
                <p className="text-lg font-semibold">{storage.perDay} GB</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Storage per Week
                </p>
                <p className="text-lg font-semibold">{storage.perWeek} GB</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Storage per Month
                </p>
                <p className="text-lg font-semibold">{storage.perMonth} GB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/cameras">
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
                Save Camera
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

