"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Camera,
  Video,
  Image as ImageIcon,
  HardDrive,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  WifiOff,
  Activity,
  MoreHorizontal,
  Search,
  Filter,
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

const mockRules = [
  {
    id: 1,
    project: "Project Alpha",
    camera: "All Cameras",
    type: "Camera Offline",
    condition: "Offline > 10 mins",
    delivery: ["Email", "Dashboard"],
    createdOn: "May 10, 2024",
    active: true,
  },
  {
    id: 2,
    project: "City Center Mall",
    camera: "Cam-04",
    type: "Object Detected",
    condition: "Person, Vehicle",
    delivery: ["WhatsApp"],
    createdOn: "May 12, 2024",
    active: true,
  },
  {
    id: 3,
    project: "Project Beta",
    camera: "Cam-03",
    type: "Storage Usage",
    condition: "Usage > 90%",
    delivery: ["Email"],
    createdOn: "May 15, 2024",
    active: false,
  },
];

const mockRecentAlerts = [
  {
    id: 1,
    type: "Camera Offline",
    project: "Project Alpha",
    camera: "Cam-02",
    time: "10 mins ago",
    delivery: "Email",
    status: "Sent",
  },
  {
    id: 2,
    type: "Object Detected",
    project: "City Center Mall",
    camera: "Cam-04",
    time: "1 hour ago",
    delivery: "WhatsApp",
    status: "Sent",
  },
  {
    id: 3,
    type: "Storage Limit",
    project: "Project Beta",
    camera: "N/A",
    time: "2 hours ago",
    delivery: "Email",
    status: "Failed",
  },
];

const alertCategories = [
  {
    id: "offline",
    title: "Camera Offline",
    icon: WifiOff,
    desc: "Alerts when cameras go offline",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "image",
    title: "New Image",
    icon: ImageIcon,
    desc: "Notifications for new captures",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "video",
    title: "Video Ready",
    icon: Video,
    desc: "Time-lapse generation complete",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "storage",
    title: "Storage Limit",
    icon: HardDrive,
    desc: "Storage usage warnings",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "detection",
    title: "Object Detected",
    icon: Eye,
    desc: "AI object detection alerts",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export default function AlertsPage() {
  // State
  const [activeTab, setActiveTab] = useState("rules");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [alertType, setAlertType] = useState("");

  // Rule Form State
  const [triggerCondition, setTriggerCondition] = useState("");
  const [selectedObjects, setSelectedObjects] = useState({
    person: false,
    vehicle: false,
    animal: false,
  });
  const [deliveryMethods, setDeliveryMethods] = useState({
    email: true,
    whatsapp: false,
    dashboard: true,
  });

  // Rules List
  const [rules, setRules] = useState(mockRules);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  // Settings State
  const [emailSettings, setEmailSettings] = useState({
    email: "admin@buildsight.com",
    offline: true,
    video: true,
    image: false,
    detection: true,
    summary: true,
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    phone: "+15550001234",
    offline: true,
    video: true,
    image: false,
    detection: false,
  });

  // Global Toggles
  const [globalToggles, setGlobalToggles] = useState({
    offline: true,
    image: true,
    video: true,
    storage: true,
    detection: true,
  });

  // Handlers
  const handleSaveRule = () => {
    if (!selectedProject || !alertType) return;

    const newRule = {
      id: Date.now(),
      project: projects.find((p) => p.id === selectedProject)?.name,
      camera: selectedCamera
        ? cameras.find((c) => c.id === selectedCamera)?.name
        : "All Cameras",
      type: alertType,
      condition: triggerCondition || "Default Condition",
      delivery: Object.keys(deliveryMethods)
        .filter((k) => deliveryMethods[k])
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
      createdOn: new Date().toLocaleDateString(),
      active: true,
    };

    setRules([newRule, ...rules]);
    // Reset form
    setSelectedProject("");
    setSelectedCamera("");
    setAlertType("");
    setTriggerCondition("");
  };

  const handleDeleteRule = () => {
    if (selectedRule) {
      setRules(rules.filter((r) => r.id !== selectedRule.id));
      setDeleteDialogOpen(false);
      setSelectedRule(null);
    }
  };

  const toggleRuleStatus = (id) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
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
              <BreadcrumbPage>Alerts & Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">
          Alerts & Notifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure alert rules, manage notification channels, and view system
          alerts.
        </p>
      </div>

      {/* Alerts Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {alertCategories.map((cat) => (
          <Card key={cat.id} className="relative overflow-hidden">
            <CardContent className="p-4 flex flex-col items-start gap-3">
              <div className={cn("p-2 rounded-lg", cat.bg)}>
                <cat.icon className={cn("h-5 w-5", cat.color)} />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-sm">{cat.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {cat.desc}
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <Switch
                  checked={globalToggles[cat.id]}
                  onCheckedChange={(c) =>
                    setGlobalToggles({ ...globalToggles, [cat.id]: c })
                  }
                  className="scale-75"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="logs">Alert Logs</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Rule Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create Alert Rule</CardTitle>
                  <CardDescription>
                    Define conditions to trigger alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select value={alertType} onValueChange={setAlertType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Camera Offline">
                          Camera Offline
                        </SelectItem>
                        <SelectItem value="Motion Detected">
                          Motion Detected
                        </SelectItem>
                        <SelectItem value="Object Detected">
                          Object Detected
                        </SelectItem>
                        <SelectItem value="Storage Usage">
                          Storage Usage
                        </SelectItem>
                        <SelectItem value="Timelapse Completed">
                          Timelapse Completed
                        </SelectItem>
                        <SelectItem value="New Image Uploaded">
                          New Image Uploaded
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional Fields */}
                  {alertType === "Camera Offline" && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
                      <Label className="text-xs">Trigger Condition</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Offline for</span>
                        <Input
                          type="number"
                          className="h-8 w-20"
                          placeholder="10"
                          value={triggerCondition}
                          onChange={(e) => setTriggerCondition(e.target.value)}
                        />
                        <span className="text-sm">minutes</span>
                      </div>
                    </div>
                  )}

                  {alertType === "Object Detected" && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
                      <Label className="text-xs">Select Objects</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="person"
                            checked={selectedObjects.person}
                            onCheckedChange={(c) =>
                              setSelectedObjects({
                                ...selectedObjects,
                                person: c,
                              })
                            }
                          />
                          <label htmlFor="person" className="text-sm">
                            Person
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="vehicle"
                            checked={selectedObjects.vehicle}
                            onCheckedChange={(c) =>
                              setSelectedObjects({
                                ...selectedObjects,
                                vehicle: c,
                              })
                            }
                          />
                          <label htmlFor="vehicle" className="text-sm">
                            Vehicle
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="animal"
                            checked={selectedObjects.animal}
                            onCheckedChange={(c) =>
                              setSelectedObjects({
                                ...selectedObjects,
                                animal: c,
                              })
                            }
                          />
                          <label htmlFor="animal" className="text-sm">
                            Animal
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {alertType === "Storage Usage" && (
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
                      <Label className="text-xs">Trigger Condition</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Usage exceeds</span>
                        <Input
                          type="number"
                          className="h-8 w-20"
                          placeholder="90"
                          value={triggerCondition}
                          onChange={(e) => setTriggerCondition(e.target.value)}
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Delivery Method</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-del"
                          checked={deliveryMethods.email}
                          onCheckedChange={(c) =>
                            setDeliveryMethods({ ...deliveryMethods, email: c })
                          }
                        />
                        <label htmlFor="email-del" className="text-sm">
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="whatsapp-del"
                          checked={deliveryMethods.whatsapp}
                          onCheckedChange={(c) =>
                            setDeliveryMethods({
                              ...deliveryMethods,
                              whatsapp: c,
                            })
                          }
                        />
                        <label htmlFor="whatsapp-del" className="text-sm">
                          WhatsApp
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dash-del"
                          checked={deliveryMethods.dashboard}
                          onCheckedChange={(c) =>
                            setDeliveryMethods({
                              ...deliveryMethods,
                              dashboard: c,
                            })
                          }
                        />
                        <label htmlFor="dash-del" className="text-sm">
                          Dashboard Notification
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={handleSaveRule}
                      disabled={!selectedProject || !alertType}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Rule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProject("");
                        setSelectedCamera("");
                        setAlertType("");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Rules Table */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Active Alert Rules</CardTitle>
                  <CardDescription>
                    Manage your configured alert rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project & Camera</TableHead>
                        <TableHead>Alert Type</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rules.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No alert rules created yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell>
                              <div className="font-medium">{rule.project}</div>
                              <div className="text-xs text-muted-foreground">
                                {rule.camera}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{rule.type}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {rule.condition}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {rule.delivery.map((d, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-[10px] px-1.5"
                                  >
                                    {d}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={rule.active}
                                onCheckedChange={() =>
                                  toggleRuleStatus(rule.id)
                                }
                                className="scale-75"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRule(rule);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => {
                                    setSelectedRule(rule);
                                    setDeleteDialogOpen(true);
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Email Settings
                </CardTitle>
                <CardDescription>
                  Configure email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input
                    value={emailSettings.email}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Camera Offline Alerts</Label>
                    <Switch
                      checked={emailSettings.offline}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, offline: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">
                      Video Generation Alerts
                    </Label>
                    <Switch
                      checked={emailSettings.video}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, video: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Image Upload Alerts</Label>
                    <Switch
                      checked={emailSettings.image}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, image: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">
                      Object Detection Alerts
                    </Label>
                    <Switch
                      checked={emailSettings.detection}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, detection: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label className="font-normal">Daily Summary Report</Label>
                    <Switch
                      checked={emailSettings.summary}
                      onCheckedChange={(c) =>
                        setEmailSettings({ ...emailSettings, summary: c })
                      }
                    />
                  </div>
                </div>

                <Button className="w-full">Save Email Settings</Button>
              </CardContent>
            </Card>

            {/* WhatsApp Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> WhatsApp Settings
                </CardTitle>
                <CardDescription>
                  Configure WhatsApp notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={whatsappSettings.phone}
                    onChange={(e) =>
                      setWhatsappSettings({
                        ...whatsappSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Camera Offline Alerts</Label>
                    <Switch
                      checked={whatsappSettings.offline}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({ ...whatsappSettings, offline: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Video Ready Alerts</Label>
                    <Switch
                      checked={whatsappSettings.video}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({ ...whatsappSettings, video: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Image Uploaded Alerts</Label>
                    <Switch
                      checked={whatsappSettings.image}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({ ...whatsappSettings, image: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">
                      Object Detected Alerts
                    </Label>
                    <Switch
                      checked={whatsappSettings.detection}
                      onCheckedChange={(c) =>
                        setWhatsappSettings({
                          ...whatsappSettings,
                          detection: c,
                        })
                      }
                    />
                  </div>
                </div>

                <Button className="w-full">Save WhatsApp Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts Log</CardTitle>
              <CardDescription>
                History of triggered system alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Project & Camera</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Delivery Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No alerts triggered yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mockRecentAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            {alert.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{alert.project}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.camera}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{alert.delivery}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              alert.status === "Sent"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600"
                            )}
                          >
                            {alert.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Alert Rule?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRule}>
              Delete Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Modal (Simplified for UI Demo) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alert Rule</DialogTitle>
            <DialogDescription>
              Modify the alert conditions for {selectedRule?.project}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alert Type</Label>
              <Input value={selectedRule?.type} disabled />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Input defaultValue={selectedRule?.condition} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
