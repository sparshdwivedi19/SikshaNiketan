"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "@/utils/api";

export default function CreateTestPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    testType: "mock",
    durationMinutes: 60,
    attemptsAllowed: 0,
    passingMarks: 0,
    randomizeQuestions: false,
    description: "",
    instructions: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Test title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/tests/course/${courseId}`, formData);
      if (res.data.status === "success") {
        toast.success("Test created successfully!");
        router.push(`/instructor/courses/${courseId}/tests/${res.data.test._id}/edit`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/instructor/courses/${courseId}/tests`}>
          <Button variant="ghost" className="p-2 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Create New Test</h1>
          <p className="text-foreground-secondary">Configure settings for your new assessment</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground-primary mb-1">Test Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Physics Chapter 1 Unit Test"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Test Type</label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
                >
                  <option value="unit">Unit Test</option>
                  <option value="chapter">Chapter Test</option>
                  <option value="mock">Mock Test</option>
                  <option value="practice">Practice Test</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Duration (Minutes) *</label>
                <Input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Passing Marks</label>
                <Input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Attempts Allowed</label>
                <div className="relative">
                  <Input
                    type="number"
                    name="attemptsAllowed"
                    value={formData.attemptsAllowed}
                    onChange={handleChange}
                    min={0}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-secondary pointer-events-none">
                    (0 = Unlimited)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground-primary mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description about the test syllabus..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground-primary mb-1">Instructions for Students</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                placeholder="Important instructions to follow during the test..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="flex items-center gap-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <input
                type="checkbox"
                id="randomizeQuestions"
                name="randomizeQuestions"
                checked={formData.randomizeQuestions}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="randomizeQuestions" className="text-sm font-medium text-foreground-primary cursor-pointer">
                Randomize Question Order
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link href={`/instructor/courses/${courseId}/tests`}>
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting}>Create Test & Add Questions</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
