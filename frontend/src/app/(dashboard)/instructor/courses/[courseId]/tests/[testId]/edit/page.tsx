"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle, Save, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "@/utils/api";

export default function EditTestPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const testId = params.testId as string;
  const router = useRouter();
  
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Question form state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const defaultQuestion = {
    type: "mcq-single",
    text: "",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" }
    ],
    correctAnswer: "A",
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    explanation: ""
  };
  
  const [questionData, setQuestionData] = useState<any>({ ...defaultQuestion });

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/tests/${testId}`);
      if (res.data.status === "success") {
        setTest(res.data.test);
      }
    } catch (error) {
      toast.error("Failed to load test details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setTest((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSaveTestSettings = async () => {
    try {
      setIsSaving(true);
      await api.put(`/tests/${testId}`, {
        title: test.title,
        description: test.description,
        instructions: test.instructions,
        durationMinutes: test.durationMinutes,
        testType: test.testType,
        passingMarks: test.passingMarks,
        attemptsAllowed: test.attemptsAllowed,
        randomizeQuestions: test.randomizeQuestions,
      });
      toast.success("Test settings updated successfully");
    } catch (error) {
      toast.error("Failed to update test settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setIsSaving(true);
      const newStatus = !test.isPublished;
      await api.put(`/tests/${testId}`, { isPublished: newStatus });
      setTest((prev: any) => ({ ...prev, isPublished: newStatus }));
      toast.success(`Test is now ${newStatus ? "Published" : "Draft"}`);
    } catch (error) {
      toast.error("Failed to change publish status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuestionSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestionId) {
        await api.put(`/tests/${testId}/questions/${editingQuestionId}`, questionData);
        toast.success("Question updated successfully");
      } else {
        await api.post(`/tests/${testId}/questions`, questionData);
        toast.success("Question added successfully");
      }
      setShowQuestionForm(false);
      setEditingQuestionId(null);
      setQuestionData({ ...defaultQuestion });
      fetchTestDetails();
    } catch (error) {
      toast.error("Failed to save question");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/tests/${testId}/questions/${questionId}`);
      toast.success("Question deleted");
      fetchTestDetails();
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const openEditQuestion = (q: any) => {
    setQuestionData({ ...q });
    setEditingQuestionId(q._id);
    setShowQuestionForm(true);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!test) return <div className="p-8 text-center text-red-500">Test not found</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/instructor/courses/${courseId}/tests`}>
            <Button variant="ghost" className="p-2 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Edit Test</h1>
            <p className="text-foreground-secondary">{test.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={test.isPublished ? "outline" : "primary"} 
            onClick={handlePublishToggle}
            isLoading={isSaving}
          >
            {test.isPublished ? "Unpublish Test" : "Publish Test"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="text-xl font-bold text-foreground-primary border-b border-gray-200 dark:border-gray-800 pb-2">Test Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-1">Title</label>
              <Input name="title" value={test.title} onChange={handleTestMetadataChange} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Duration (mins)</label>
                <Input type="number" name="durationMinutes" value={test.durationMinutes} onChange={handleTestMetadataChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Passing Marks</label>
                <Input type="number" name="passingMarks" value={test.passingMarks || 0} onChange={handleTestMetadataChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Test Type</label>
                <select
                  name="testType"
                  value={test.testType}
                  onChange={handleTestMetadataChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700 text-sm"
                >
                  <option value="unit">Unit Test</option>
                  <option value="chapter">Chapter Test</option>
                  <option value="mock">Mock Test</option>
                  <option value="practice">Practice Test</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Attempts</label>
                <Input type="number" name="attemptsAllowed" value={test.attemptsAllowed || 0} onChange={handleTestMetadataChange} />
              </div>
            </div>

            <Button onClick={handleSaveTestSettings} className="w-full mt-2" isLoading={isSaving} leftIcon={<Save size={16} />}>
              Save Settings
            </Button>
          </Card>
        </div>

        {/* Right Column: Questions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 flex justify-between items-center bg-brand-50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30">
            <div>
              <h2 className="text-xl font-bold text-foreground-primary">Questions ({test.questions?.length || 0})</h2>
              <p className="text-sm text-foreground-secondary">Manage the questions for this test</p>
            </div>
            {!showQuestionForm && (
              <Button onClick={() => setShowQuestionForm(true)} leftIcon={<Plus size={16} />}>
                Add Question
              </Button>
            )}
          </Card>

          {showQuestionForm && (
            <Card className="p-6 border-2 border-brand-500/50">
              <h3 className="text-lg font-bold mb-4">{editingQuestionId ? "Edit Question" : "New Question"}</h3>
              <form onSubmit={handleQuestionSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Question Type</label>
                  <select
                    value={questionData.type}
                    onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
                  >
                    <option value="mcq-single">Single Choice (MCQ)</option>
                    <option value="mcq-multiple">Multiple Choice</option>
                    <option value="numerical">Numerical</option>
                    <option value="truefalse">True / False</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Question Text *</label>
                  <textarea
                    required
                    rows={3}
                    value={questionData.text}
                    onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
                  />
                </div>

                {/* Options for MCQ */}
                {(questionData.type === "mcq-single" || questionData.type === "mcq-multiple") && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                    <label className="block text-sm font-medium">Options</label>
                    {questionData.options.map((opt: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <span className="font-bold text-gray-500 w-6">{opt.id}.</span>
                        <Input
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...questionData.options];
                            newOpts[idx].text = e.target.value;
                            setQuestionData({ ...questionData, options: newOpts });
                          }}
                          placeholder={`Option ${opt.id}`}
                          className="flex-1"
                        />
                        <input
                          type={questionData.type === "mcq-single" ? "radio" : "checkbox"}
                          name="correctAnswer"
                          checked={questionData.type === "mcq-single" ? questionData.correctAnswer === opt.id : questionData.correctAnswer.includes(opt.id)}
                          onChange={() => {
                            if (questionData.type === "mcq-single") {
                              setQuestionData({ ...questionData, correctAnswer: opt.id });
                            } else {
                              const curr = Array.isArray(questionData.correctAnswer) ? questionData.correctAnswer : [];
                              if (curr.includes(opt.id)) {
                                setQuestionData({ ...questionData, correctAnswer: curr.filter((c: string) => c !== opt.id) });
                              } else {
                                setQuestionData({ ...questionData, correctAnswer: [...curr, opt.id] });
                              }
                            }
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="text-xs text-gray-500">Correct</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer for Numerical / TrueFalse */}
                {(questionData.type === "numerical" || questionData.type === "truefalse") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Correct Answer *</label>
                    {questionData.type === "truefalse" ? (
                      <select
                        value={questionData.correctAnswer}
                        onChange={(e) => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <Input
                        required
                        value={questionData.correctAnswer}
                        onChange={(e) => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
                        placeholder="e.g. 42"
                      />
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marks</label>
                    <Input type="number" required value={questionData.marks} onChange={(e) => setQuestionData({ ...questionData, marks: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Negative Marks</label>
                    <Input type="number" required value={questionData.negativeMarks} onChange={(e) => setQuestionData({ ...questionData, negativeMarks: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                    <select
                      value={questionData.difficulty}
                      onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-background-secondary border-gray-300 dark:border-gray-700"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowQuestionForm(false);
                    setEditingQuestionId(null);
                    setQuestionData({ ...defaultQuestion });
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingQuestionId ? "Update Question" : "Save Question"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {test.questions?.map((q: any, index: number) => (
              <Card key={q._id} className="p-4 flex gap-4">
                <div className="flex-none font-bold text-gray-400 dark:text-gray-600">Q{index + 1}.</div>
                <div className="flex-grow space-y-2">
                  <div className="font-medium text-foreground-primary">{q.text}</div>
                  
                  {q.type.startsWith("mcq") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt: any) => (
                        <div key={opt.id} className={`text-sm p-2 border rounded ${
                          (q.type === "mcq-single" ? q.correctAnswer === opt.id : q.correctAnswer.includes(opt.id))
                            ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 font-medium"
                            : "border-gray-100 bg-gray-50 text-gray-600 dark:bg-gray-800/30 dark:border-gray-700 dark:text-gray-400"
                        }`}>
                          <span className="font-bold mr-2">{opt.id}.</span> {opt.text}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 mt-3 text-xs text-foreground-secondary">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">+{q.marks} / -{q.negativeMarks} Marks</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded capitalize">{q.difficulty}</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded capitalize">{q.type.replace("-", " ")}</span>
                  </div>
                </div>
                
                <div className="flex-none flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20" onClick={() => openEditQuestion(q)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20" onClick={() => handleDeleteQuestion(q._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}

            {test.questions?.length === 0 && !showQuestionForm && (
              <div className="text-center p-8 text-foreground-secondary border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800">
                <p>No questions added yet.</p>
                <Button onClick={() => setShowQuestionForm(true)} variant="outline" className="mt-4" leftIcon={<Plus size={16} />}>
                  Add First Question
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
