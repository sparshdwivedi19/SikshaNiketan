"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "@/utils/api";

interface Test {
  _id: string;
  title: string;
  testType: string;
  durationMinutes: number;
  isPublished: boolean;
  attemptsAllowed: number;
  questions: any[];
  createdAt: string;
}

export default function CourseTestsManagement() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, [courseId]);

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/tests/course/${courseId}`);
      if (res.data.status === "success") {
        setTests(res.data.tests);
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      toast.error("Failed to load tests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (testId: string, testTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${testTitle}"?`)) return;
    setDeletingId(testId);
    try {
      await api.delete(`/tests/${testId}`);
      setTests((prev) => prev.filter((t) => t._id !== testId));
      toast.success("Test deleted successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete test.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Manage Course Tests</h1>
          <p className="text-foreground-secondary">
            {isLoading ? "Loading..." : `${tests.length} test${tests.length !== 1 ? "s" : ""} for this course`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/instructor/courses`}>
            <Button variant="outline">Back to Courses</Button>
          </Link>
          <Link href={`/instructor/courses/${courseId}/tests/create`}>
            <Button rightIcon={<Plus size={18} />}>Create New Test</Button>
          </Link>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-foreground-secondary bg-gray-50/50 dark:bg-gray-800/30">
                <th className="p-4 font-medium">Test Title</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Questions</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="p-4 font-bold text-sm text-foreground-primary group-hover:text-brand-600 transition-colors">
                      {test.title}
                    </td>
                    <td className="p-4 text-sm text-foreground-secondary capitalize">{test.testType?.replace("_", " ")}</td>
                    <td className="p-4 text-sm text-foreground-secondary">{test.questions?.length || 0}</td>
                    <td className="p-4 text-sm text-foreground-secondary">{test.durationMinutes} mins</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex w-max items-center gap-1 ${
                        test.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                      }`}>
                        {test.isPublished ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {test.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/instructor/courses/${courseId}/tests/${test._id}/results`} title="View Results">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/instructor/courses/${courseId}/tests/${test._id}/edit`} title="Edit Test">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-brand-600">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          isLoading={deletingId === test._id}
                          onClick={() => handleDelete(test._id, test.title)}
                        >
                          {deletingId !== test._id && <Trash2 size={16} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-foreground-secondary">
                    <div>
                      <p className="mb-4">No tests created for this course yet.</p>
                      <Link href={`/instructor/courses/${courseId}/tests/create`}>
                        <Button leftIcon={<Plus size={16} />}>Create First Test</Button>
                      </Link>
                    </div>
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
