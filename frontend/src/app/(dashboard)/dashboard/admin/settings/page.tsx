"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Settings, Globe, Mail, Phone, BookOpen, Save, Bell, Shield, Database } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Shiksha Niketan",
    tagline: "Master Your Future With India's Best Educators",
    supportEmail: "support@shikshaniketan.in",
    supportPhone: "+91 9876543210",
    maxCoursesPerInstructor: "10",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newUserEmail: true,
    newEnrollmentEmail: true,
    systemAlerts: true,
    weeklyReport: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1 flex items-center gap-3">
            <Settings size={28} className="text-brand-500" /> System Settings
          </h1>
          <p className="text-foreground-secondary">Manage platform-wide configurations.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} leftIcon={!isSaving ? <Save size={18} /> : undefined}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-background-secondary text-brand-600 shadow-sm"
                : "text-foreground-secondary hover:text-foreground-primary"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold font-heading text-foreground-primary mb-5 flex items-center gap-2">
              <Globe size={20} className="text-brand-500" /> Platform Information
            </h3>
            <div className="space-y-4">
              <Input
                label="Platform Name"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
              />
              <Input
                label="Platform Tagline"
                value={generalSettings.tagline}
                onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
              />
              <Input
                label="Support Email"
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                leftIcon={<Mail size={18} />}
              />
              <Input
                label="Support Phone"
                value={generalSettings.supportPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                leftIcon={<Phone size={18} />}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold font-heading text-foreground-primary mb-5 flex items-center gap-2">
              <BookOpen size={20} className="text-brand-500" /> Course Limits
            </h3>
            <Input
              label="Max Courses Per Instructor"
              type="number"
              value={generalSettings.maxCoursesPerInstructor}
              onChange={(e) => setGeneralSettings({ ...generalSettings, maxCoursesPerInstructor: e.target.value })}
            />
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <Card className="p-6">
          <h3 className="text-lg font-bold font-heading text-foreground-primary mb-5 flex items-center gap-2">
            <Bell size={20} className="text-brand-500" /> Email Notifications
          </h3>
          <div className="space-y-4">
            {[
              { key: "newUserEmail", label: "New user registration", description: "Receive an email when a new user registers." },
              { key: "newEnrollmentEmail", label: "New course enrollment", description: "Receive an email for every new enrollment." },
              { key: "systemAlerts", label: "System alerts", description: "Critical system health alerts and errors." },
              { key: "weeklyReport", label: "Weekly performance report", description: "Summary of platform metrics every Monday." },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 transition-colors">
                <div>
                  <p className="font-medium text-foreground-primary">{item.label}</p>
                  <p className="text-sm text-foreground-secondary mt-0.5">{item.description}</p>
                </div>
                <button
                  onClick={() => setNotificationSettings((s) => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                    notificationSettings[item.key as keyof typeof notificationSettings] ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform m-0.5 ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold font-heading text-foreground-primary mb-5 flex items-center gap-2">
              <Shield size={20} className="text-brand-500" /> Security Configuration
            </h3>
            <div className="space-y-4">
              {[
                { label: "Require Email Verification", description: "New users must verify their email before accessing the platform.", enabled: false },
                { label: "Two-Factor Authentication (Admin)", description: "Require 2FA for all admin accounts.", enabled: false },
                { label: "Rate Limiting", description: "Limit API requests to prevent abuse (currently enabled).", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="font-medium text-foreground-primary">{item.label}</p>
                    <p className="text-sm text-foreground-secondary mt-0.5">{item.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${item.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.enabled ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
              <Database size={20} /> Database Info
            </h3>
            <p className="text-sm text-foreground-secondary mb-3">Connected to MongoDB Atlas — sikhshaniketan cluster.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="font-bold text-foreground-primary">Database</p>
                <p className="text-foreground-secondary">sikhshaniketan</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="font-bold text-foreground-primary">Status</p>
                <p className="text-green-600 font-medium">● Connected</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
