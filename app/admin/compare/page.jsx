"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Image as ImageIcon,
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
import { Switch } from "@/components/ui/switch";
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

const mockTimelineImages = [
  {
    id: 1,
    timestamp: "2024-11-24 08:00 AM",
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
  },
  {
    id: 2,
    timestamp: "2024-11-24 10:00 AM",
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
  },
  {
    id: 3,
    timestamp: "2024-11-24 12:00 PM",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
  },
  {
    id: 4,
    timestamp: "2024-11-24 02:00 PM",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  },
  {
    id: 5,
    timestamp: "2024-11-24 04:00 PM",
    url: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800",
  },
  {
    id: 6,
    timestamp: "2024-11-24 06:00 PM",
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800",
  },
];

// Image Viewer Component with Zoom & Pan
const ImageViewer = ({ src, alt, label, showDifference }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 1));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="relative h-full flex flex-col min-h-0">
      {/* Label */}
      <div className="mb-2 flex items-center justify-between flex-shrink-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 bg-muted rounded-lg overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Difference Overlay */}
        {showDifference && (
          <div className="absolute inset-0 bg-red-500/20 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/40 rounded-full blur-xl" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-red-500/40 rounded-full blur-xl" />
          </div>
        )}

        {/* Zoom Indicator */}
        {zoom > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default function CompareImagePage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [showDifference, setShowDifference] = useState(false);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  const availableCameras = selectedProject
    ? mockCameras[selectedProject] || []
    : [];

  const handleCompare = () => {
    if (selectedProject && selectedCamera && date1 && date2) {
      setIsComparing(true);
    }
  };

  const handleReset = () => {
    setSelectedProject("");
    setSelectedCamera("");
    setDate1("");
    setDate2("");
    setIsComparing(false);
    setShowDifference(false);
    setSelectedTimelineIndex(0);
    setIsPlaying(false);
  };

  // Timeline playback
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setSelectedTimelineIndex((prev) => {
          if (prev >= mockTimelineImages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const handlePrevious = () => {
    setSelectedTimelineIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedTimelineIndex((prev) =>
      Math.min(mockTimelineImages.length - 1, prev + 1)
    );
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
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
              <BreadcrumbPage>Compare Images</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">Compare Images</h1>
        <p className="text-muted-foreground mt-1">
          Select two dates to compare construction progress side-by-side
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Project Dropdown */}
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

            {/* Camera Dropdown */}
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

            {/* Date 1 Picker */}
            <div className="space-y-2">
              <Label htmlFor="date1">Date 1</Label>
              <div className="relative">
                <Input
                  id="date1"
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  disabled={!selectedCamera}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Date 2 Picker */}
            <div className="space-y-2">
              <Label htmlFor="date2">Date 2</Label>
              <div className="relative">
                <Input
                  id="date2"
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  disabled={!selectedCamera}
                  className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Compare Button */}
            <div className="space-y-2">
              <Label className="invisible">Action</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleCompare}
                  disabled={
                    !selectedProject || !selectedCamera || !date1 || !date2
                  }
                  className="flex-1"
                >
                  Compare
                </Button>
                {isComparing && (
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!isComparing && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <ImageIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Select two dates to start comparing images
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Choose a project, camera, and two dates from the filters above to
              view side-by-side comparison and timeline analysis
            </p>
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Comparison */}
      {isComparing && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Side-by-Side Comparison
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="difference-toggle"
                    className="text-sm cursor-pointer"
                  >
                    Highlight Differences
                  </Label>
                  <Switch
                    id="difference-toggle"
                    checked={showDifference}
                    onCheckedChange={setShowDifference}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 h-[500px]">
                <ImageViewer
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"
                  alt="Image from Date 1"
                  label={`Image — ${date1 || "Date 1"}`}
                  showDifference={showDifference}
                />
                <ImageViewer
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
                  alt="Image from Date 2"
                  label={`Image — ${date2 || "Date 2"}`}
                  showDifference={showDifference}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline Image Display */}
              <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
                <img
                  src={mockTimelineImages[selectedTimelineIndex].url}
                  alt={`Timeline ${mockTimelineImages[selectedTimelineIndex].timestamp}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  {mockTimelineImages[selectedTimelineIndex].timestamp}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={selectedTimelineIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-10 w-10"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={
                    selectedTimelineIndex === mockTimelineImages.length - 1
                  }
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline Scrubber */}
              <div className="space-y-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mockTimelineImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setSelectedTimelineIndex(index);
                        setIsPlaying(false);
                      }}
                      className={cn(
                        "flex-shrink-0 relative group transition-all",
                        selectedTimelineIndex === index
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image.url}
                          alt={image.timestamp}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded text-center truncate">
                        {image.timestamp.split(" ")[1]}{" "}
                        {image.timestamp.split(" ")[2]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
