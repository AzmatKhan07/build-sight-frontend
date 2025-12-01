"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Settings,
  Play,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2,
  Eye,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Box,
  Layers,
  RefreshCw,
  X,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const projects = [
  { id: "p1", name: "Project Alpha" },
  { id: "p2", name: "Project Beta" },
  { id: "p3", name: "City Center Mall" },
];

const cameras = [
  { id: "c1", name: "Cam-01 (Main Entrance)", projectId: "p1" },
  { id: "c2", name: "Cam-02 (Lobby)", projectId: "p1" },
  { id: "c3", name: "Cam-03 (Parking)", projectId: "p2" },
  { id: "c4", name: "Cam-04 (Roof)", projectId: "p3" },
];

const mockHistory = [
  {
    id: 1,
    project: "Project Alpha",
    camera: "Cam-01",
    date: "2024-05-20 14:30:00",
    objects: 8,
    confidence: "85% - 98%",
    thumbnail:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&q=80",
    status: "success",
  },
  {
    id: 2,
    project: "City Center Mall",
    camera: "Cam-04",
    date: "2024-05-19 09:15:00",
    objects: 12,
    confidence: "72% - 95%",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&q=80",
    status: "success",
  },
  {
    id: 3,
    project: "Project Beta",
    camera: "Cam-03",
    date: "2024-05-18 18:45:00",
    objects: 3,
    confidence: "90% - 99%",
    thumbnail:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&q=80",
    status: "success",
  },
];

const mockDetectionResult = {
  summary: {
    total: 5,
    breakdown: { Person: 2, Vehicle: 2, "Hard Hat": 1 },
    processingTime: "1.2s",
  },
  objects: [
    {
      id: 1,
      label: "Person",
      confidence: 0.98,
      box: { x: 10, y: 20, w: 15, h: 40 },
      color: "blue",
    },
    {
      id: 2,
      label: "Person",
      confidence: 0.95,
      box: { x: 30, y: 25, w: 14, h: 38 },
      color: "blue",
    },
    {
      id: 3,
      label: "Vehicle",
      confidence: 0.92,
      box: { x: 50, y: 50, w: 30, h: 25 },
      color: "red",
    },
    {
      id: 4,
      label: "Vehicle",
      confidence: 0.88,
      box: { x: 10, y: 60, w: 25, h: 20 },
      color: "red",
    },
    {
      id: 5,
      label: "Hard Hat",
      confidence: 0.99,
      box: { x: 12, y: 20, w: 5, h: 5 },
      color: "yellow",
    },
  ],
};

// --- Components ---

export default function ObjectDetectionPage() {
  // State
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [isFetchingFrame, setIsFetchingFrame] = useState(false);

  // Detection Settings
  const [detectionMode, setDetectionMode] = useState("general");
  const [confidenceThreshold, setConfidenceThreshold] = useState([50]);
  const [maxObjects, setMaxObjects] = useState(50);

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  // Image Viewer State
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef(null);

  // History
  const [history, setHistory] = useState(mockHistory);
  const [viewResultModalOpen, setViewResultModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setDetectionResult(null); // Reset results on new image
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setDetectionResult(null);
    }
  };

  const handleFetchFrame = () => {
    if (!selectedCamera) return;
    setIsFetchingFrame(true);
    // Simulate API call
    setTimeout(() => {
      setSelectedImage(
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200"
      );
      setIsFetchingFrame(false);
      setDetectionResult(null);
    }, 1500);
  };

  const handleRunDetection = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setDetectionResult(mockDetectionResult);
      setIsProcessing(false);
      // Add to history (mock)
      const newHistoryItem = {
        id: Date.now(),
        project: selectedProject
          ? projects.find((p) => p.id === selectedProject)?.name
          : "Upload",
        camera: selectedCamera
          ? cameras.find((c) => c.id === selectedCamera)?.name
          : "N/A",
        date: new Date().toLocaleString(),
        objects: mockDetectionResult.objects.length,
        confidence: "88% - 99%",
        thumbnail: selectedImage,
        status: "success",
      };
      setHistory([newHistoryItem, ...history]);
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      imageContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events to update state if user presses Esc
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <BreadcrumbPage>Object Detection</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">Object Detection</h1>
        <p className="text-muted-foreground mt-1">
          Analyze images and camera frames to detect objects, people, and
          vehicles.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Source & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Source Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Image Source</CardTitle>
              <CardDescription>
                Select an image or fetch from camera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  {!selectedImage ? (
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    >
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFileSelect}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG or PNG (max 10MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video group">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedImage(null);
                            setDetectionResult(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select
                      value={selectedProject}
                      onValueChange={setSelectedProject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Camera</Label>
                    <Select
                      value={selectedCamera}
                      onValueChange={setSelectedCamera}
                      disabled={!selectedProject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameras
                          .filter((c) => c.projectId === selectedProject)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!selectedCamera || isFetchingFrame}
                    onClick={handleFetchFrame}
                  >
                    {isFetchingFrame ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Fetching Frame...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Fetch Latest Frame
                      </>
                    )}
                  </Button>
                  {activeTab === "camera" && selectedImage && (
                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mt-4">
                      <img
                        src={selectedImage}
                        alt="Camera Frame"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Detection Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Detection Mode</Label>
                <Select value={detectionMode} onValueChange={setDetectionMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      General Objects (COCO)
                    </SelectItem>
                    <SelectItem value="person">
                      Person Detection Only
                    </SelectItem>
                    <SelectItem value="vehicle">
                      Vehicle Detection Only
                    </SelectItem>
                    <SelectItem value="custom">Custom Labels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Confidence Threshold</Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {confidenceThreshold}%
                  </span>
                </div>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Objects Limit</Label>
                <Input
                  type="number"
                  value={maxObjects}
                  onChange={(e) => setMaxObjects(e.target.value)}
                  min={1}
                  max={100}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleRunDetection}
                disabled={!selectedImage || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Detection...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Detection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Result Area */}
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>
                  {detectionResult
                    ? `Found ${detectionResult.summary.total} objects in ${detectionResult.summary.processingTime}`
                    : "Results will appear here"}
                </CardDescription>
              </div>
              {detectionResult && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(1)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[400px] bg-muted/30">
              {!selectedImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Box className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    No Image Selected
                  </h3>
                  <p className="text-sm max-w-xs">
                    Upload an image or select a camera frame to start object
                    detection.
                  </p>
                </div>
              ) : (
                <div
                  ref={imageContainerRef}
                  className="relative w-full h-full overflow-auto flex items-center justify-center bg-black/5"
                >
                  <div
                    className="relative transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <img
                      src={selectedImage}
                      alt="Analysis Target"
                      className="max-w-full max-h-[600px] object-contain shadow-lg"
                    />

                    {/* Bounding Boxes Overlay */}
                    {detectionResult &&
                      detectionResult.objects.map((obj) => (
                        <div
                          key={obj.id}
                          className={cn(
                            "absolute border-2 flex flex-col",
                            obj.color === "blue" && "border-blue-500",
                            obj.color === "red" && "border-red-500",
                            obj.color === "yellow" && "border-yellow-500"
                          )}
                          style={{
                            left: `${obj.box.x}%`,
                            top: `${obj.box.y}%`,
                            width: `${obj.box.w}%`,
                            height: `${obj.box.h}%`,
                          }}
                        >
                          <div
                            className={cn(
                              "absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-bold text-white rounded-t-sm whitespace-nowrap flex items-center gap-1",
                              obj.color === "blue" && "bg-blue-500",
                              obj.color === "red" && "bg-red-500",
                              obj.color === "yellow" && "bg-yellow-500"
                            )}
                          >
                            <span>{obj.label}</span>
                            <span className="opacity-80">
                              {(obj.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>

            {/* Results List Panel */}
            {detectionResult && (
              <div className="border-t bg-card">
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Detected Objects
                  </h4>
                  <ScrollArea className="h-[120px] w-full">
                    <div className="flex gap-3 pb-2">
                      {detectionResult.objects.map((obj) => (
                        <div
                          key={obj.id}
                          className="flex-shrink-0 w-[180px] p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                obj.color === "blue" &&
                                  "border-blue-200 text-blue-700 bg-blue-50",
                                obj.color === "red" &&
                                  "border-red-200 text-red-700 bg-red-50",
                                obj.color === "yellow" &&
                                  "border-yellow-200 text-yellow-700 bg-yellow-50"
                              )}
                            >
                              {obj.label}
                            </Badge>
                            <span className="text-xs font-mono font-medium">
                              {(obj.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="text-[10px] text-muted-foreground grid grid-cols-2 gap-1">
                            <span>X: {obj.box.x}</span>
                            <span>Y: {obj.box.y}</span>
                            <span>W: {obj.box.w}</span>
                            <span>H: {obj.box.h}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Detection History */}
      <Card>
        <CardHeader>
          <CardTitle>Detection History</CardTitle>
          <CardDescription>
            Review past detection results and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Preview</TableHead>
                <TableHead>Project & Camera</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Objects</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No detection history yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-10 w-16 rounded overflow-hidden bg-muted">
                        <img
                          src={item.thumbnail}
                          alt="Thumb"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.project}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.camera}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {item.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.objects} Detected</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {item.confidence}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedHistoryItem(item);
                            setViewResultModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setHistory(history.filter((h) => h.id !== item.id))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Result Modal */}
      <Dialog open={viewResultModalOpen} onOpenChange={setViewResultModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detection Result Details</DialogTitle>
            <DialogDescription>
              {selectedHistoryItem?.date} • {selectedHistoryItem?.project}
            </DialogDescription>
          </DialogHeader>

          {selectedHistoryItem && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                <img
                  src={selectedHistoryItem.thumbnail}
                  alt="Result"
                  className="w-full h-full object-contain"
                />
                {/* Mock bounding boxes for history view - just for visual */}
                <div className="absolute top-[20%] left-[10%] w-[15%] h-[40%] border-2 border-blue-500">
                  <div className="absolute -top-6 left-[-2px] bg-blue-500 text-white text-[10px] px-1 font-bold">
                    Person 98%
                  </div>
                </div>
                <div className="absolute top-[50%] left-[50%] w-[30%] h-[25%] border-2 border-red-500">
                  <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] px-1 font-bold">
                    Vehicle 92%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Objects:
                      </span>
                      <span className="font-medium">
                        {selectedHistoryItem.objects}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Confidence Range:
                      </span>
                      <span className="font-medium">
                        {selectedHistoryItem.confidence}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera:</span>
                      <span className="font-medium">
                        {selectedHistoryItem.camera}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Detected Classes</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Person (2)</Badge>
                    <Badge variant="outline">Vehicle (2)</Badge>
                    <Badge variant="outline">Hard Hat (1)</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewResultModalOpen(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
