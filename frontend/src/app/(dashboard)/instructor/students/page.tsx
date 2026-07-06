"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, BookOpen, UserCheck, Search, Ban, CheckCircle2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";

interface Enrollment {
  _id: string;
  enrolledAt: string;
  progress: number;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  };
  course?: { title: string };
}

export default function InstructorStudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      // Get instructor's stats which includes courses
      const statsRes = await api.get("/stats/instructor");
      if (statsRes.data.status === "success" && statsRes.data.stats.courses.length > 0) {
        // Fetch enrollments for first course as example (in production, aggregate all)
        const courseId = statsRes.data.stats.courses[0]._id;
        const enrollRes = await api.get(`/enrollments/course/${courseId}`);
        if (enrollRes.data.status === "success") {
          setEnrollments(enrollRes.data.enrollments);
        }
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">My Students</h1>
          <p className="text-foreground-secondary">Students enrolled in your courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-2"><Users size={16} className="text-brand-500" /> Total Students</div>
          <div className="text-3xl font-bold text-foreground-primary">{enrollments.length}</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-2"><CheckCircle2 size={16} className="text-green-500" /> Active</div>
          <div className="text-3xl font-bold text-foreground-primary">{enrollments.length}</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-2"><BookOpen size={16} className="text-purple-500" /> Courses Taught</div>
          <div className="text-3xl font-bold text-foreground-primary">1</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-foreground-secondary text-sm">
                <th className="p-4 font-medium border-b border-gray-200 dark:border-gray-800">Student</th>
                <th className="p-4 font-medium border-b border-gray-200 dark:border-gray-800">Progress</th>
                <th className="p-4 font-medium border-b border-gray-200 dark:border-gray-800">Enrolled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-foreground-secondary">Loading students...</td>
                </tr>
              ) : filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold">
                          {enrollment.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground-primary">{enrollment.user?.name}</p>
                          <p className="text-xs text-foreground-secondary">{enrollment.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                        </div>
                        <span className="text-sm text-foreground-secondary">{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground-secondary">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-foreground-secondary">
                    {searchTerm ? `No students found matching "${searchTerm}"` : "No students enrolled yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
