"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Trash2,
  Camera,
  Eye,
  EyeOff,
  Check,
  X,
  Monitor,
  Clock,
  AlertTriangle,
  Upload,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock user data
const initialUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@buildsight.com",
  phone: "+1 (555) 123-4567",
  username: "johndoe",
  address: "123 Construction Ave, Building City, BC 12345",
  timezone: "America/New_York",
  role: "Admin",
  status: "Active",
  avatar:
    "https://ui-avatars.com/api/?name=John+Doe&size=200&background=3b82f6&color=fff",
};

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
];

const recentSessions = [
  {
    id: 1,
    device: "Chrome on Windows",
    location: "New York, USA",
    time: "Current session",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iPhone",
    location: "New York, USA",
    time: "2 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "Chrome on MacOS",
    location: "Boston, USA",
    time: "Yesterday",
    current: false,
  },
];

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(initialUserData);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    cameraOffline: true,
    videoGeneration: true,
    projectActivity: true,
    systemAnnouncements: false,
  });

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    if (strength < 40) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength < 70)
      return { strength, label: "Medium", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleUpdatePassword = () => {
    // Password update logic here
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveNotifications = () => {
    // Save notification preferences
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
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-background"
                />
                <button
                  onClick={() => setPhotoDialogOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-24"
                onClick={() => setPhotoDialogOpen(true)}
              >
                <Camera className="h-3 w-3 mr-1" />
                Change
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {userData.firstName} {userData.lastName}
                </h2>
                <Badge className="rounded-full bg-green-500/10 text-green-600">
                  {userData.status}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  {userData.role}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
                {userData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {userData.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={
                      isEditing ? editedData.firstName : userData.firstName
                    }
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        firstName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={isEditing ? editedData.lastName : userData.lastName}
                    onChange={(e) =>
                      setEditedData({ ...editedData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={isEditing ? editedData.phone : userData.phone}
                    onChange={(e) =>
                      setEditedData({ ...editedData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder={
                      !userData.phone ? "No phone number added yet" : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={isEditing ? editedData.username : userData.username}
                    onChange={(e) =>
                      setEditedData({ ...editedData, username: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={isEditing ? editedData.timezone : userData.timezone}
                    onValueChange={(value) =>
                      setEditedData({ ...editedData, timezone: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Textarea
                    id="address"
                    value={isEditing ? editedData.address : userData.address}
                    onChange={(e) =>
                      setEditedData({ ...editedData, address: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={2}
                    placeholder={
                      !userData.address ? "No address added yet" : ""
                    }
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleSaveProfile}>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a strong password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Password strength:
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            passwordStrength.label === "Weak" && "text-red-600",
                            passwordStrength.label === "Medium" &&
                              "text-yellow-600",
                            passwordStrength.label === "Strong" &&
                              "text-green-600"
                          )}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength.strength}
                        className={cn(
                          "h-1.5",
                          `[&>div]:${passwordStrength.color}`
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleUpdatePassword}
                  disabled={
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.current && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          {session.time}
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-6">
                <Shield className="h-4 w-4 mr-2" />
                Logout from All Devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="email-alerts"
                      className="text-base cursor-pointer"
                    >
                      Email Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="sms-alerts"
                      className="text-base cursor-pointer"
                    >
                      SMS Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={notifications.smsAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="camera-offline"
                      className="text-base cursor-pointer"
                    >
                      Camera Offline Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when cameras go offline
                    </p>
                  </div>
                  <Switch
                    id="camera-offline"
                    checked={notifications.cameraOffline}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        cameraOffline: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="video-generation"
                      className="text-base cursor-pointer"
                    >
                      Video Generation Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when time-lapse videos are ready
                    </p>
                  </div>
                  <Switch
                    id="video-generation"
                    checked={notifications.videoGeneration}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        videoGeneration: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="project-activity"
                      className="text-base cursor-pointer"
                    >
                      Project Activity Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Updates about project progress and changes
                    </p>
                  </div>
                  <Switch
                    id="project-activity"
                    checked={notifications.projectActivity}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        projectActivity: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="system-announcements"
                      className="text-base cursor-pointer"
                    >
                      System Announcements
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Important system updates and maintenance notices
                    </p>
                  </div>
                  <Switch
                    id="system-announcements"
                    checked={notifications.systemAnnouncements}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        systemAnnouncements: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="mt-6">
                <Check className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Delete Account */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-destructive mb-1">
                    Delete Account
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deleting your account will permanently remove all associated
                    data including projects, cameras, images, and videos. This
                    action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Type your email to confirm:{" "}
                <span className="font-mono">{userData.email}</span>
              </Label>
              <Input id="confirm-email" placeholder="Enter your email" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo. Recommended size: 400x400px
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <img
                src={userData.avatar}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-background"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setPhotoDialogOpen(false)}>
              Upload Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
