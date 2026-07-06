"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, ArrowLeft, Upload, Plus, GripVertical, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface Lesson {
  id: number;
  title: string;
  type: 'Video' | 'Quiz';
  size: string;
  ext: string;
  videoUrl?: string;
  isUploading?: boolean;
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

  const handleAddModule = () => {
    setModules(prev => [...prev, {
      id: Date.now(),
      title: `Module ${prev.length + 1}: New Module`,
      lessons: []
    }]);
    toast.success("New module added.");
  };

  const handleAddLesson = (moduleId: number, type: 'Video' | 'Quiz', customTitle?: string, customSize?: string, videoUrl?: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: Date.now(),
            title: customTitle || (type === 'Video' ? `New Video Lesson` : `New Quiz`),
            type: type,
            size: customSize || (type === 'Video' ? '0 mins' : '10 Questions'),
            ext: type === 'Video' ? 'MP4 Video' : 'Interactive Quiz',
            videoUrl: videoUrl
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

    // Create a temporary lesson to show loading state
    const tempLessonId = Date.now();
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: tempLessonId,
            title: file.name,
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

      // In production, this would upload to S3. For MVP, uploads locally.
      const response = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status === "success") {
        // Update the temporary lesson with success state and video URL
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
      // Remove failed upload
      handleDeleteLesson(moduleId, tempLessonId);
    } finally {
      e.target.value = ''; // reset input
    }
  };

  const handleDeleteModule = (moduleId: number) => {
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

  const handlePublish = async () => {
    if (!courseData.title || !courseData.description || !courseData.price) {
      toast.error("Please fill in all basic course details (Title, Description, Price).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create the Course
      const coursePayload = {
        title: courseData.title,
        slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: courseData.description,
        thumbnail: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=800", // placeholder
        category: courseData.category,
        level: courseData.level,
        price: Number(courseData.price),
        discountPrice: courseData.discountPrice ? Number(courseData.discountPrice) : undefined,
        isPublished: true
      };

      const courseRes = await api.post("/courses", coursePayload);
      
      if (courseRes.data.status === "success") {
        const courseId = courseRes.data.course._id;

        // 2. Save Curriculum
        const hasLessons = modules.some(m => m.lessons.length > 0);
        if (hasLessons) {
          await api.post(`/courses/${courseId}/lessons`, { modules });
        }

        toast.success("Course published successfully!");
        router.push("/instructor/courses");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="ghost" className="p-2 h-auto"><ArrowLeft size={20} /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground-primary">Create New Course</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save as Draft</Button>
          <Button rightIcon={<Save size={16} />} isLoading={isSubmitting} onClick={handlePublish}>Publish Course</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-1">
        {["basic", "curriculum", "pricing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab 
                ? "border-brand-500 text-brand-600 dark:text-brand-400" 
                : "border-transparent text-foreground-secondary hover:text-foreground-primary"
            }`}
          >
            {tab} Information
          </button>
        ))}
      </div>

      {activeTab === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Basic Details</h3>
              <div className="space-y-4">
                <Input 
                  label="Course Title" 
                  placeholder="e.g. Complete JEE Physics Masterclass" 
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground-secondary ml-1">Course Description</label>
                  <textarea 
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[150px]"
                    placeholder="Describe what students will learn..."
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground-secondary ml-1">Category</label>
                    <select 
                      className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={courseData.category}
                      onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    >
                      <option>JEE Main</option>
                      <option>JEE Advanced</option>
                      <option>NEET</option>
                      <option>Foundation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground-secondary ml-1">Level</label>
                    <select 
                      className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={courseData.level}
                      onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                    >
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Dropper</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Course Thumbnail</h3>
              <div className="aspect-video w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-foreground-secondary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <Upload size={32} className="mb-2 text-gray-400" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs mt-1">1920x1080 recommended</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "curriculum" && (
        <Card className="p-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h3 className="font-bold text-lg">Curriculum Builder</h3>
            <Button size="sm" variant="outline" rightIcon={<Plus size={16} />} onClick={handleAddModule}>Add Module</Button>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <GripVertical size={18} className="text-gray-400 cursor-move shrink-0" />
                    <input 
                      type="text" 
                      value={module.title}
                      onChange={(e) => setModules(modules.map(m => m.id === module.id ? { ...m, title: e.target.value } : m))}
                      className="bg-transparent border-none focus:ring-0 p-0 text-foreground-primary font-bold w-full"
                    />
                  </div>
                  <div className="flex gap-2 items-center flex-wrap shrink-0">
                    <input 
                      type="file" 
                      id={`video-upload-${module.id}`} 
                      className="hidden" 
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, module.id)}
                    />
                    <Button variant="ghost" size="sm" className="h-8 text-brand-600 hover:bg-brand-50" onClick={() => document.getElementById(`video-upload-${module.id}`)?.click()}>
                      <Upload size={16} className="mr-1" /> Upload Video
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-brand-600 hover:bg-brand-50" onClick={() => handleAddLesson(module.id, 'Quiz')}><Plus size={16} className="mr-1" /> Add Quiz</Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50" onClick={() => handleDeleteModule(module.id)}><Trash2 size={16} /></Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {module.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className={`flex items-center justify-between p-3 border rounded-lg shadow-sm animate-in fade-in duration-200 ${lesson.isUploading ? "border-brand-300 bg-brand-50/50" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-background-secondary"}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GripVertical size={16} className="text-gray-300 cursor-move shrink-0" />
                        <span className="text-sm font-medium truncate">{idx + 1}. {lesson.title}</span>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.isUploading ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-100 text-brand-700 animate-pulse">Uploading...</span>
                          ) : (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lesson.type === 'Video' ? 'bg-brand-100 text-brand-700' : 'bg-purple-100 text-purple-700'}`}>
                              {lesson.ext}
                            </span>
                          )}
                          {!lesson.isUploading && lesson.videoUrl && (
                            <span className="text-green-600" title="Video uploaded"><CheckCircle size={14} /></span>
                          )}
                          <span className="text-xs text-foreground-secondary hidden sm:inline-block">{lesson.size}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 shrink-0 ml-2" onClick={() => handleDeleteLesson(module.id, lesson.id)} disabled={lesson.isUploading}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  {module.lessons.length === 0 && (
                    <div className="text-center p-4 text-sm text-foreground-secondary border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                      No lessons yet. Add a video or quiz to get started.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "pricing" && (
        <Card className="p-6 max-w-2xl animate-in fade-in duration-300">
          <h3 className="font-bold text-lg mb-6">Pricing & Access</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Regular Price (₹)" 
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
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground-primary">Free Preview</h4>
                <p className="text-sm text-foreground-secondary">Allow students to view the first module for free.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
