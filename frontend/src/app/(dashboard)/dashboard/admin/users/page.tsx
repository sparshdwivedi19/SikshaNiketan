"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Ban, CheckCircle2, Mail, Plus, RefreshCw, MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  faculty: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  student: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  parent: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
};

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users");
      if (response.data.status === "success") {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      toast.error("Failed to load users from database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    setTogglingId(userId);
    try {
      await api.patch(`/users/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
      );
      toast.success(`${userName} has been ${currentStatus ? "deactivated" : "activated"}.`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user status.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">User Management</h1>
          <p className="text-foreground-secondary">
            {isLoading ? "Loading..." : `${users.length} total users in the system`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchUsers} leftIcon={<RefreshCw size={16} />}>
            Refresh
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-2">
            {["all", "student", "faculty", "parent", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  roleFilter === role
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-foreground-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {role === "all" ? `All (${users.length})` : role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto relative max-h-[600px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-surface/90 dark:bg-background-secondary/90 backdrop-blur-md shadow-sm">
              <tr className="text-foreground-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-gray-100 dark:border-brand-800/50">User Details</th>
                <th className="p-4 border-b border-gray-100 dark:border-brand-800/50">Role</th>
                <th className="p-4 border-b border-gray-100 dark:border-brand-800/50">Status</th>
                <th className="p-4 border-b border-gray-100 dark:border-brand-800/50">Joined</th>
                <th className="p-4 border-b border-gray-100 dark:border-brand-800/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-brand-800/50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-1/4 rounded-md" />
                          <Skeleton className="h-3 w-1/3 rounded-md" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                <AnimatePresence>
                  {filteredUsers.map((user, idx) => (
                    <motion.tr 
                      key={user._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold shrink-0 shadow-sm border border-brand-200 dark:border-brand-700 group-hover:scale-110 transition-transform">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground-primary group-hover:text-brand-600 transition-colors">{user.name}</p>
                            <p className="text-[11px] text-foreground-secondary flex items-center gap-1.5 font-medium mt-0.5">
                              <Mail size={12} className="opacity-70" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${roleColors[user.role] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          user.isActive
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                        }`}>
                          {user.isActive ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground-secondary font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={togglingId === user._id}
                          onClick={() => handleToggleStatus(user._id, user.isActive, user.name)}
                          className={user.isActive ? "text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20" : "text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20"}
                        >
                          {togglingId === user._id ? "" : user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={5} className="p-12">
                    <EmptyState 
                      icon={<Search size={32} />}
                      title="No users found"
                      description={searchTerm ? `We couldn't find any users matching "${searchTerm}".` : "There are currently no users in the system."}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20 text-sm text-foreground-secondary">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </span>
        </div>
      </Card>
    </div>
  );
}
