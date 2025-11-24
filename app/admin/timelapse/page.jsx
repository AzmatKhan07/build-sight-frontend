"use client";

import React, { useState } from "react";
import {
  Video,
  Download,
  Trash2,
  Play,
  RotateCcw,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock data
const mockProjects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
  { id: 4, name: "Project Delta" },
];

const mockCameras = {
  1: [
    { id: 1, name: "Camera 001 - North Entrance" },
    { id: 2, name: "Camera 002 - South Wing" },
    { id: 3, name: "Camera 003 - Main Hall" },
  ],
  2: [
    { id: 4, name: "Camera 004 - East Gate" },
    { id: 5, name: "Camera 005 - West Parking" },
  ],
  3: [
    { id: 6, name: "Camera 006 - Lobby" },
    { id: 7, name: "Camera 007 - Rooftop" },
  ],
  4: [
    { id: 8, name: "Camera 008 - Ground Floor" },
    { id: 9, name: "Camera 009 - Second Floor" },
  ],
};

const mockHistory = [
  {
    id: 1,
    project: "Project Alpha",
    camera: "Camera 001 - North Entrance",
    startDate: "2024-11-01 08:00",
    endDate: "2024-11-15 18:00",
    quality: "High",
    createdAt: "2024-11-16 10:30",
    duration: "2:45",
  },
  {
    id: 2,
    project: "Project Beta",
    camera: "Camera 004 - East Gate",
    startDate: "2024-10-20 09:00",
    endDate: "2024-11-10 17:00",
    quality: "Ultra",
    createdAt: "2024-11-11 14:20",
    duration: "3:12",
  },
  {
    id: 3,
    project: "Project Gamma",
    camera: "Camera 006 - Lobby",
    startDate: "2024-10-01 07:00",
    endDate: "2024-10-31 19:00",
    quality: "Medium",
    createdAt: "2024-11-01 09:15",
    duration: "4:30",
  },
];

const videoSpeeds = [
  { value: "1", label: "1x" },
  { value: "2", label: "2x" },
  { value: "5", label: "5x" },
  { value: "10", label: "10x" },
  { value: "20", label: "20x" },
  { value: "50", label: "50x" },
];

const qualities = [
  { value: "low", label: "Low (480p)" },
  { value: "medium", label: "Medium (720p)" },
  { value: "high", label: "High (1080p)" },
  { value: "ultra", label: "Ultra (4K)" },
];

const frameIntervals = [
  { value: "1", label: "Every 1 minute" },
  { value: "5", label: "Every 5 minutes" },
  { value: "10", label: "Every 10 minutes" },
  { value: "30", label: "Every 30 minutes" },
  { value: "60", label: "Every 1 hour" },
];

const generationSteps = [
  { id: 1, label: "Preparing images...", progress: 25 },
  { id: 2, label: "Processing frames...", progress: 50 },
  { id: 3, label: "Rendering video...", progress: 75 },
  { id: 4, label: "Finalizing...", progress: 100 },
];

export default function TimelapsePage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [videoSpeed, setVideoSpeed] = useState("10");
  const [quality, setQuality] = useState("high");
  const [frameInterval, setFrameInterval] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const availableCameras = selectedProject
    ? mockCameras[selectedProject] || []
    : [];

  const handleGenerate = () => {
    if (selectedProject && selectedCamera && startDateTime && endDateTime) {
      setIsGenerating(true);
      setGenerationComplete(false);
      setCurrentStep(0);
      setProgress(0);

      // Simulate generation process
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= generationSteps.length) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              setGenerationComplete(true);
            }, 500);
            return prev;
          }
          setProgress(generationSteps[next].progress);
          return next;
        });
      }, 2000);
    }
  };

  const handleReset = () => {
    setSelectedProject("");
    setSelectedCamera("");
    setStartDateTime("");
    setEndDateTime("");
    setVideoSpeed("10");
    setQuality("high");
    setFrameInterval("5");
    setIsGenerating(false);
    setGenerationComplete(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleCancel = () => {
    setIsGenerating(false);
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Time-Lapse Video</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">Time-Lapse Video</h1>
        <p className="text-muted-foreground mt-1">
          Generate time-lapse videos from construction camera footage
        </p>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Video Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Camera Selection */}
            <div className="space-y-2">
              <Label htmlFor="camera">Camera</Label>
              <Select
                value={selectedCamera}
                onValueChange={setSelectedCamera}
                disabled={!selectedProject}
              >
                <SelectTrigger id="camera">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {availableCameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id.toString()}>
                      {camera.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Video Speed */}
            <div className="space-y-2">
              <Label htmlFor="speed">Video Speed</Label>
              <Select value={videoSpeed} onValueChange={setVideoSpeed}>
                <SelectTrigger id="speed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {videoSpeeds.map((speed) => (
                    <SelectItem key={speed.value} value={speed.value}>
                      {speed.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date-Time */}
            <div className="space-y-2">
              <Label htmlFor="start-datetime">Start Date & Time</Label>
              <div className="relative">
                <Input
                  id="start-datetime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  disabled={!selectedCamera}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* End Date-Time */}
            <div className="space-y-2">
              <Label htmlFor="end-datetime">End Date & Time</Label>
              <div className="relative">
                <Input
                  id="end-datetime"
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  disabled={!selectedCamera}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger id="quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualities.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Frame Interval */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="interval">Frame Sampling Interval</Label>
              <Select value={frameInterval} onValueChange={setFrameInterval}>
                <SelectTrigger id="interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frameIntervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <Label className="invisible">Actions</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    !selectedProject ||
                    !selectedCamera ||
                    !startDateTime ||
                    !endDateTime ||
                    isGenerating
                  }
                  className="flex-1 md:flex-none"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Generate Time-Lapse
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {isGenerating && (
        <Card className="border-primary/50 animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Generating Time-Lapse Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {generationSteps[currentStep]?.label}
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time: 2–5 minutes</span>
            </div>

            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel Generation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isGenerating && !generationComplete && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Video className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Configure time range and settings
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select a project, camera, and date-time range to generate a
              time-lapse video from construction footage
            </p>
          </CardContent>
        </Card>
      )}

      {/* Video Output */}
      {generationComplete && (
        <Card className="animate-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="text-lg">Generated Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                poster="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
              >
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">2:45</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Resolution</p>
                <p className="font-medium">1920x1080</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Frames</p>
                <p className="font-medium">4,320</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time Range</p>
                <p className="font-medium">14 days</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Video
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Project
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Camera
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Time Range
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Quality
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Created
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="font-medium">{item.project}</div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {item.camera}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="space-y-0.5">
                          <div>{item.startDate}</div>
                          <div className="text-muted-foreground">
                            {item.endDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {item.quality}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{item.duration}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {item.createdAt}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                No timelapse videos generated yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
