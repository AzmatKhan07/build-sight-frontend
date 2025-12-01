"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Mail,
  Share2,
  Trash2,
  Eye,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Save,
  FileSpreadsheet,
  File as FileIcon,
  MessageSquare,
  AlertCircle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";

// Recharts for graphs
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

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
    name: "Weekly Activity Report",
    type: "Camera Activity",
    project: "Project Alpha",
    cameras: "All Cameras",
    dateRange: "May 13 - May 19, 2024",
    generatedOn: "May 20, 2024",
    format: "PDF",
  },
  {
    id: 2,
    name: "Offline Alerts Log",
    type: "Offline Alerts",
    project: "City Center Mall",
    cameras: "Cam-04",
    dateRange: "May 01 - May 15, 2024",
    generatedOn: "May 16, 2024",
    format: "Excel",
  },
  {
    id: 3,
    name: "Storage Usage Summary",
    type: "Storage Usage",
    project: "All Projects",
    cameras: "All Cameras",
    dateRange: "April 2024",
    generatedOn: "May 01, 2024",
    format: "PDF",
  },
];

// Mock Graph Data
const activityData = [
  { name: "Mon", active: 40, idle: 24 },
  { name: "Tue", active: 30, idle: 13 },
  { name: "Wed", active: 20, idle: 58 },
  { name: "Thu", active: 27, idle: 39 },
  { name: "Fri", active: 18, idle: 48 },
  { name: "Sat", active: 23, idle: 38 },
  { name: "Sun", active: 34, idle: 43 },
];

const offlineData = [
  { name: "Cam-01", alerts: 4 },
  { name: "Cam-02", alerts: 1 },
  { name: "Cam-03", alerts: 8 },
  { name: "Cam-04", alerts: 2 },
];

const storageData = [
  { name: "Video", value: 400 },
  { name: "Images", value: 300 },
  { name: "Logs", value: 100 },
  { name: "Other", value: 50 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ReportsPage() {
  // State
  const [reportType, setReportType] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formats, setFormats] = useState({
    pdf: true,
    excel: false,
    csv: false,
  });
  const [delivery, setDelivery] = useState({
    screen: true,
    email: false,
    whatsapp: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reportViewMode, setReportViewMode] = useState("table"); // table, summary, graph

  const [history, setHistory] = useState(mockHistory);
  const [viewReportModalOpen, setViewReportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Settings State
  const [emailSettings, setEmailSettings] = useState({
    email: "admin@buildsight.com",
    autoSend: true,
    includePdf: true,
    includeCsv: false,
    summaryOnly: false,
  });
  const [whatsappSettings, setWhatsappSettings] = useState({
    phone: "+15550001234",
    autoSend: false,
    alertsOnly: true,
  });

  // Handlers
  const handleGenerate = () => {
    if (!reportType || !selectedProject) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedReport({
        type: reportType,
        project: projects.find((p) => p.id === selectedProject)?.name,
        dateRange: `${startDate} to ${endDate}`,
        data: [], // Mock data would go here
      });
      setIsGenerating(false);
      // Add to history
      const newReport = {
        id: Date.now(),
        name: `${reportType} - ${new Date().toLocaleDateString()}`,
        type: reportType,
        project: projects.find((p) => p.id === selectedProject)?.name,
        cameras: selectedCamera
          ? cameras.find((c) => c.id === selectedCamera)?.name
          : "All Cameras",
        dateRange: `${startDate} to ${endDate}`,
        generatedOn: new Date().toLocaleDateString(),
        format: formats.pdf ? "PDF" : "Excel",
      };
      setHistory([newReport, ...history]);
    }, 1500);
  };

  const clearForm = () => {
    setReportType("");
    setSelectedProject("");
    setSelectedCamera("");
    setStartDate("");
    setEndDate("");
    setGeneratedReport(null);
  };

  const handleDeleteReport = () => {
    if (selectedReport) {
      setHistory(history.filter((h) => h.id !== selectedReport.id));
      setDeleteConfirmOpen(false);
      setSelectedReport(null);
    }
  };

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
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate, view, and export detailed reports on system activity and
          performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Generation & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Generate Report Card */}
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>
                Select parameters to create a custom report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Camera Activity">
                      Camera Activity Report
                    </SelectItem>
                    <SelectItem value="Offline Alerts">
                      Camera Offline Alerts Report
                    </SelectItem>
                    <SelectItem value="Storage Usage">
                      Storage Usage Report
                    </SelectItem>
                    <SelectItem value="Timelapse Log">
                      Timelapse Generation Log
                    </SelectItem>
                    <SelectItem value="Object Detection">
                      Object Detection Summary
                    </SelectItem>
                    <SelectItem value="Custom">
                      Custom Date Range Report
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectValue placeholder="All Cameras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cameras</SelectItem>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pdf"
                      checked={formats.pdf}
                      onCheckedChange={(c) =>
                        setFormats({ ...formats, pdf: c })
                      }
                    />
                    <label
                      htmlFor="pdf"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      PDF
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excel"
                      checked={formats.excel}
                      onCheckedChange={(c) =>
                        setFormats({ ...formats, excel: c })
                      }
                    />
                    <label
                      htmlFor="excel"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Excel
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="csv"
                      checked={formats.csv}
                      onCheckedChange={(c) =>
                        setFormats({ ...formats, csv: c })
                      }
                    />
                    <label
                      htmlFor="csv"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      CSV
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Delivery Options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="screen"
                      checked={delivery.screen}
                      onCheckedChange={(c) =>
                        setDelivery({ ...delivery, screen: c })
                      }
                    />
                    <label
                      htmlFor="screen"
                      className="text-sm font-medium leading-none"
                    >
                      Display on Screen
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={delivery.email}
                      onCheckedChange={(c) =>
                        setDelivery({ ...delivery, email: c })
                      }
                    />
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none"
                    >
                      Email
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp"
                      checked={delivery.whatsapp}
                      onCheckedChange={(c) =>
                        setDelivery({ ...delivery, whatsapp: c })
                      }
                    />
                    <label
                      htmlFor="whatsapp"
                      className="text-sm font-medium leading-none"
                    >
                      WhatsApp
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleGenerate}
                  disabled={isGenerating || !reportType || !selectedProject}
                >
                  {isGenerating ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
                <Button variant="outline" onClick={clearForm}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Delivery Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure automated report delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Mail className="h-4 w-4" /> Email Settings
                </div>
                <div className="space-y-3 pl-6 border-l-2 border-muted ml-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Recipient Email</Label>
                    <Input
                      value={emailSettings.email}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          email: e.target.value,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-normal">
                      Auto-send reports
                    </Label>
                    <Switch
                      checked={emailSettings.autoSend}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, autoSend: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-normal">Include PDF</Label>
                    <Switch
                      checked={emailSettings.includePdf}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, includePdf: c })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <MessageSquare className="h-4 w-4" /> WhatsApp Settings
                </div>
                <div className="space-y-3 pl-6 border-l-2 border-muted ml-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number</Label>
                    <Input
                      value={whatsappSettings.phone}
                      onChange={(e) =>
                        setWhatsappSettings({
                          ...whatsappSettings,
                          phone: e.target.value,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-normal">
                      Auto-send reports
                    </Label>
                    <Switch
                      checked={whatsappSettings.autoSend}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({
                          ...whatsappSettings,
                          autoSend: c,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-normal">
                      Only send alerts
                    </Label>
                    <Switch
                      checked={whatsappSettings.alertsOnly}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({
                          ...whatsappSettings,
                          alertsOnly: c,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="secondary">
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Display & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Preview Section */}
          <Card className="min-h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {generatedReport
                    ? `${generatedReport.type} for ${generatedReport.project}`
                    : "No report generated"}
                </CardDescription>
              </div>
              {generatedReport && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportViewMode("table")}
                    className={reportViewMode === "table" ? "bg-accent" : ""}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportViewMode("graph")}
                    className={reportViewMode === "graph" ? "bg-accent" : ""}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              {!generatedReport ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                  <div className="bg-muted rounded-full p-6">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ready to Generate</h3>
                    <p className="text-sm max-w-sm mt-1">
                      Select a report type, project, and date range from the
                      panel on the left to generate detailed analytics.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Report Actions */}
                  <div className="flex flex-wrap gap-2 pb-4 border-b">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" /> WhatsApp
                    </Button>
                  </div>

                  {/* Report Content */}
                  <div className="min-h-[300px]">
                    {reportViewMode === "table" ? (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Camera</TableHead>
                              <TableHead>Event</TableHead>
                              <TableHead className="text-right">
                                Value
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <TableRow key={i}>
                                <TableCell>May {10 + i}, 2024</TableCell>
                                <TableCell>Cam-0{(i % 4) + 1}</TableCell>
                                <TableCell>Activity Log</TableCell>
                                <TableCell className="text-right">
                                  {Math.floor(Math.random() * 100)} events
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {reportType === "Storage Usage" ? (
                            <RechartsPieChart>
                              <Pie
                                data={storageData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {storageData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          ) : reportType === "Offline Alerts" ? (
                            <BarChart data={offlineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="alerts"
                                fill="#ef4444"
                                name="Offline Alerts"
                              />
                            </BarChart>
                          ) : (
                            <RechartsLineChart data={activityData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="active"
                                stroke="#8884d8"
                                name="Active Hours"
                              />
                              <Line
                                type="monotone"
                                dataKey="idle"
                                stroke="#82ca9d"
                                name="Idle Hours"
                              />
                            </RechartsLineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Reports History */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports History</CardTitle>
              <CardDescription>
                Access and manage previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated On</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No reports generated yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-4 w-4 text-blue-500" />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.generatedOn}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {item.format}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(item);
                                setViewReportModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedReport(item);
                                setDeleteConfirmOpen(true);
                              }}
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
        </div>
      </div>

      {/* View Report Modal */}
      <Dialog open={viewReportModalOpen} onOpenChange={setViewReportModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              Generated on {selectedReport?.generatedOn} •{" "}
              {selectedReport?.project}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 bg-muted/20 border rounded-md p-8 overflow-auto flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white shadow-sm border p-8 min-h-[500px]">
              <div className="text-center border-b pb-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  BuildSight Report
                </h2>
                <p className="text-slate-500">{selectedReport?.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <span className="text-slate-500 block">Project:</span>
                  <span className="font-medium">{selectedReport?.project}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Range:</span>
                  <span className="font-medium">
                    {selectedReport?.dateRange}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cameras:</span>
                  <span className="font-medium">{selectedReport?.cameras}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Generated By:</span>
                  <span className="font-medium">Admin User</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Summary Data</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Events</TableCell>
                      <TableCell className="text-right">1,245</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Active Hours</TableCell>
                      <TableCell className="text-right">142 hrs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Alerts Triggered</TableCell>
                      <TableCell className="text-right">12</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewReportModalOpen(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download {selectedReport?.format}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedReport?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReport}>
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
