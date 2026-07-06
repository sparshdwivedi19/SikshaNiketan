"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, ArrowLeft, Upload, Plus, GripVertical, Trash2, CheckCircle, Image as ImageIcon, HelpCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Image from "next/image";

interface Lesson {
  id: number;
  title: string;
  type: 'Video' | 'Quiz';
  size: string;
  ext: string;
  videoUrl?: string;
  isUploading?: boolean;
  quizQuestions?: { question: string; options: string[]; correctOptionIndex: number }[];
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CreateCourse() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Thumbnail State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>("");

  // Quiz Builder State
  const [quizModal, setQuizModal] = useState<{ open: boolean, moduleId: number | null, lessonId: number | null }>({ open: false, moduleId: null, lessonId: null });
  const [editingQuestions, setEditingQuestions] = useState<{ question: string; options: string[]; correctOptionIndex: number }[]>([]);

  // Basic Info State
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "JEE Main",
    level: "Class 11",
    price: "",
    discountPrice: "",
  });

  // Curriculum State
  const [modules, setModules] = useState<Module[]>([
    {
      id: Date.now(),
      title: 'Module 1: Introduction',
      lessons: []
    }
  ]);

  // ─────────────────── THUMBNAIL UPLOAD ───────────────────
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setThumbnailFile(file);

    // Upload to backend
    setIsUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        setUploadedThumbnailUrl(res.data.url);
        toast.success("Thumbnail uploaded!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Thumbnail upload failed");
      setThumbnailPreview(null);
      setThumbnailFile(null);
    } finally {
      setIsUploadingThumb(false);
      e.target.value = "";
    }
  };

  // ─────────────────── CURRICULUM ───────────────────
  const handleAddModule = () => {
    setModules(prev => [...prev, {
      id: Date.now(),
      title: `Module ${prev.length + 1}: New Module`,
      lessons: []
    }]);
    toast.success("New module added.");
  };

  const handleAddLesson = (moduleId: number, type: 'Video' | 'Quiz') => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: Date.now(),
            title: type === 'Video' ? `New Video Lesson` : `Quiz ${m.lessons.filter(l => l.type === 'Quiz').length + 1}`,
            type,
            size: type === 'Video' ? '0 mins' : '0 Questions',
            ext: type === 'Video' ? 'MP4 Video' : 'Interactive Quiz',
            quizQuestions: type === 'Quiz' ? [] : undefined,
          }]
        };
      }
      return m;
    }));
    toast.success(`${type} added to module.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, moduleId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempLessonId = Date.now();
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: tempLessonId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            type: 'Video',
            size: sizeMb,
            ext: 'Uploading...',
            isUploading: true
          }]
        };
      }
      return m;
    }));

    try {
      const formData = new FormData();
      formData.append("video", file);
      const response = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status === "success") {
        setModules(prev => prev.map(m => {
          if (m.id === moduleId) {
            return {
              ...m,
              lessons: m.lessons.map(l =>
                l.id === tempLessonId
                  ? { ...l, ext: 'MP4 Video', isUploading: false, videoUrl: response.data.url }
                  : l
              )
            };
          }
          return m;
        }));
        toast.success("Video uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload video.");
      handleDeleteLesson(moduleId, tempLessonId);
    } finally {
      e.target.value = '';
    }
  };

  const handleDeleteModule = (moduleId: number) => {
    if (modules.length === 1) { toast.error("At least one module is required."); return; }
    setModules(prev => prev.filter(m => m.id !== moduleId));
    toast.success("Module deleted.");
  };

  const handleDeleteLesson = (moduleId: number, lessonId: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  // ─────────────────── PUBLISH ───────────────────
  const handlePublish = async () => {
    if (!courseData.title.trim()) { toast.error("Course title is required."); setActiveTab("basic"); return; }
    if (!courseData.description.trim()) { toast.error("Course description is required."); setActiveTab("basic"); return; }
    if (!courseData.price || Number(courseData.price) <= 0) { toast.error("Please set a valid course price."); setActiveTab("pricing"); return; }
    if (isUploadingThumb) { toast.error("Please wait for thumbnail upload to complete."); return; }

    setIsSubmitting(true);
    try {
      const slug = courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

      const coursePayload = {
        title: courseData.title.trim(),
        slug,
        description: courseData.description.trim(),
        thumbnail: uploadedThumbnailUrl || undefined,
        category: courseData.category,
        level: courseData.level,
        price: Number(courseData.price),
        discountPrice: courseData.discountPrice ? Number(courseData.discountPrice) : undefined,
        isPublished: true,
      };

      const courseRes = await api.post("/courses", coursePayload);

      if (courseRes.data.status === "success") {
        const courseId = courseRes.data.course._id;

        const hasLessons = modules.some(m => m.lessons.length > 0);
        if (hasLessons) {
          await api.post(`/courses/${courseId}/lessons`, { modules });
        }

        toast.success("🎉 Course published successfully!");
        router.push("/dashboard/admin/courses");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to publish course.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!courseData.title.trim()) { toast.error("Course title is required to save a draft."); return; }
    setIsSubmitting(true);
    try {
      const slug = courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-draft-' + Date.now();
      await api.post("/courses", {
        title: courseData.title.trim(),
        slug,
        description: courseData.description.trim() || "Draft course",
        thumbnail: uploadedThumbnailUrl || undefined,
        category: courseData.category,
        level: courseData.level,
        price: Number(courseData.price) || 0,
        isPublished: false,
      });
      toast.success("Draft saved!");
      router.push("/dashboard/admin/courses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save draft.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/courses">
            <Button variant="ghost" className="p-2 h-auto"><ArrowLeft size={20} /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground-primary">Create New Course</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">Fill in the details below to publish a course.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>Save as Draft</Button>
          <Button rightIcon={<Save size={16} />} isLoading={isSubmitting} onClick={handlePublish}>Publish Course</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-1">
        {["basic", "curriculum", "pricing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-foreground-secondary hover:text-foreground-primary"
            }`}
          >
            {tab === "basic" ? "📝 Basic Info" : tab === "curriculum" ? "📚 Curriculum" : "💰 Pricing"}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground-primary">Basic Details</h3>
              <div className="space-y-4">
                <Input
                  label="Course Title *"
                  placeholder="e.g. Complete JEE Physics Masterclass"
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground-secondary ml-1">Course Description *</label>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[150px] text-foreground-primary resize-none"
                    placeholder="Describe what students will learn in detail..."
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground-secondary ml-1">Category</label>
                    <select
                      className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={courseData.category}
                      onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    >
                      <option>JEE Main</option>
                      <option>JEE Advanced</option>
                      <option>NEET</option>
                      <option>Foundation (Class 6-10)</option>
                      <option>Board Exams</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground-secondary ml-1">Level</label>
                    <select
                      className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={courseData.level}
                      onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                    >
                      <option>Class 6</option>
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Dropper</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-1 text-foreground-primary">Course Thumbnail</h3>
              <p className="text-xs text-foreground-secondary mb-4">Recommended: 1280×720px (JPG or PNG, max 5MB)</p>

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />

              <div
                className={`aspect-video w-full rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                  thumbnailPreview
                    ? "border-brand-400"
                    : "border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10"
                }`}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="relative w-full h-full group">
                    <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Click to change</span>
                    </div>
                    {isUploadingThumb && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {uploadedThumbnailUrl && !isUploadingThumb && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    {isUploadingThumb ? (
                      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
                    ) : (
                      <ImageIcon size={32} className="mb-2 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-foreground-secondary">
                      {isUploadingThumb ? "Uploading..." : "Click to upload thumbnail"}
                    </span>
                    <span className="text-xs text-foreground-secondary mt-1">JPG, PNG up to 5MB</span>
                  </div>
                )}
              </div>

              {thumbnailFile && !isUploadingThumb && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailPreview(null);
                    setThumbnailFile(null);
                    setUploadedThumbnailUrl("");
                  }}
                  className="mt-2 text-xs text-red-500 hover:underline w-full text-center"
                >
                  Remove thumbnail
                </button>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === "curriculum" && (
        <Card className="p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-foreground-primary">Curriculum Builder</h3>
              <p className="text-sm text-foreground-secondary mt-0.5">Add modules and upload videos or create quizzes.</p>
            </div>
            <Button size="sm" variant="outline" leftIcon={<Plus size={16} />} onClick={handleAddModule}>Add Module</Button>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical size={18} className="text-gray-400 cursor-move shrink-0" />
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => setModules(modules.map(m => m.id === module.id ? { ...m, title: e.target.value } : m))}
                      className="bg-transparent border-none focus:ring-0 p-0 text-foreground-primary font-bold w-full text-sm"
                    />
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <input
                      type="file"
                      id={`video-upload-${module.id}`}
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, module.id)}
                    />
                    <Button
                      variant="ghost" size="sm"
                      className="h-8 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      onClick={() => document.getElementById(`video-upload-${module.id}`)?.click()}
                      leftIcon={<Upload size={14} />}
                    >
                      Upload Video
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="h-8 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      onClick={() => handleAddLesson(module.id, 'Quiz')}
                      leftIcon={<HelpCircle size={14} />}
                    >
                      Add Quiz
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {module.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        lesson.isUploading
                          ? "border-brand-300 bg-brand-50/50 dark:bg-brand-900/10"
                          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-background-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GripVertical size={16} className="text-gray-400 cursor-move shrink-0" />
                        <span className="text-sm font-medium text-foreground-primary truncate">{idx + 1}. {lesson.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.isUploading ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-100 text-brand-700 animate-pulse">Uploading...</span>
                          ) : (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              lesson.type === 'Video'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}>
                              {lesson.ext}
                            </span>
                          )}
                          {!lesson.isUploading && lesson.videoUrl && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                          {lesson.type === 'Quiz' && (
                            <span className="text-xs text-foreground-secondary">{lesson.quizQuestions?.length || 0} Qs</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {lesson.type === 'Quiz' && (
                          <Button
                            variant="outline" size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => {
                              setEditingQuestions(lesson.quizQuestions || []);
                              setQuizModal({ open: true, moduleId: module.id, lessonId: lesson.id });
                            }}
                          >
                            Edit Quiz
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                          disabled={lesson.isUploading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {module.lessons.length === 0 && (
                    <div className="text-center p-6 text-sm text-foreground-secondary border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                      No lessons yet. Upload a video or add a quiz above.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <Card className="p-6 max-w-2xl animate-in fade-in duration-300">
          <h3 className="font-bold text-lg mb-6 text-foreground-primary">Pricing & Access</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Regular Price (₹) *"
                type="number"
                placeholder="4999"
                value={courseData.price}
                onChange={(e) => setCourseData({...courseData, price: e.target.value})}
              />
              <Input
                label="Discounted Price (₹)"
                type="number"
                placeholder="2999"
                value={courseData.discountPrice}
                onChange={(e) => setCourseData({...courseData, discountPrice: e.target.value})}
              />
            </div>
            {courseData.price && courseData.discountPrice && Number(courseData.discountPrice) < Number(courseData.price) && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                💰 Students save ₹{(Number(courseData.price) - Number(courseData.discountPrice)).toLocaleString()} ({Math.round(((Number(courseData.price) - Number(courseData.discountPrice)) / Number(courseData.price)) * 100)}% off)
              </div>
            )}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground-primary">Free Preview</h4>
                <p className="text-sm text-foreground-secondary">Allow students to preview the first module for free.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Quiz Builder Modal */}
      {quizModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-secondary rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-xl text-foreground-primary">Quiz Question Builder</h3>
                <p className="text-sm text-foreground-secondary mt-0.5">{editingQuestions.length} question(s) added</p>
              </div>
            </div>

            <div className="space-y-6">
              {editingQuestions.map((q, qIndex) => (
                <div key={qIndex} className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-brand-600">Question {qIndex + 1}</span>
                    <Button
                      variant="ghost" size="sm"
                      className="text-red-500 hover:bg-red-50 h-7 w-7 p-0"
                      onClick={() => setEditingQuestions(prev => prev.filter((_, i) => i !== qIndex))}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Input
                    label="Question"
                    placeholder="Enter your question here..."
                    value={q.question}
                    onChange={e => {
                      const newQ = [...editingQuestions];
                      newQ[qIndex].question = e.target.value;
                      setEditingQuestions(newQ);
                    }}
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">Options (select the correct answer)</label>
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctOptionIndex === oIndex}
                          onChange={() => {
                            const newQ = [...editingQuestions];
                            newQ[qIndex].correctOptionIndex = oIndex;
                            setEditingQuestions(newQ);
                          }}
                          className="w-4 h-4 text-brand-500 accent-brand-500"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          value={opt}
                          onChange={e => {
                            const newQ = [...editingQuestions];
                            newQ[qIndex].options[oIndex] = e.target.value;
                            setEditingQuestions(newQ);
                          }}
                          className={`flex-1 h-9 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-foreground-primary ${
                            q.correctOptionIndex === oIndex
                              ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-background-secondary"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {editingQuestions.length === 0 && (
              <div className="text-center py-10 text-foreground-secondary">
                <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No questions yet. Click below to add your first question.</p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              leftIcon={<Plus size={16} />}
              onClick={() => setEditingQuestions(prev => [...prev, { question: "", options: ["", "", "", ""], correctOptionIndex: 0 }])}
            >
              Add Question
            </Button>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setQuizModal({ open: false, moduleId: null, lessonId: null })}>
                Cancel
              </Button>
              <Button onClick={() => {
                const validQuestions = editingQuestions.filter(q => q.question.trim() && q.options.every(o => o.trim()));
                if (validQuestions.length === 0 && editingQuestions.length > 0) {
                  toast.error("Please fill in all questions and options.");
                  return;
                }
                setModules(prev => prev.map(m => {
                  if (m.id === quizModal.moduleId) {
                    return {
                      ...m,
                      lessons: m.lessons.map(l => {
                        if (l.id === quizModal.lessonId) {
                          return { ...l, quizQuestions: validQuestions, size: `${validQuestions.length} Questions` };
                        }
                        return l;
                      })
                    };
                  }
                  return m;
                }));
                setQuizModal({ open: false, moduleId: null, lessonId: null });
                toast.success(`Quiz saved with ${validQuestions.length} question(s)`);
              }}>
                Save Quiz ({editingQuestions.length} Qs)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
