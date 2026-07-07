"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Plus, Save, Trash2, GripVertical, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

interface QuizBuilderProps {
  courseId: string;
  lessonId: string;
  backUrl: string;
}

export const QuizBuilder = ({ courseId, lessonId, backUrl }: QuizBuilderProps) => {
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [duration, setDuration] = useState(60);
  const [passingMarks, setPassingMarks] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  // New Question Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const initialForm = {
    type: "mcq-single",
    text: "",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" }
    ],
    correctAnswer: "A" as any,
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    explanation: ""
  };
  
  const [qForm, setQForm] = useState(initialForm);

  useEffect(() => {
    fetchTest();
  }, [courseId, lessonId]);

  const fetchTest = async () => {
    setIsLoading(true);
    try {
      // Create or get the test linked to this lesson
      const res = await api.post(`/tests/lesson/${courseId}/${lessonId}`);
      if (res.data.status === "success") {
        const testData = res.data.test;
        setTest(testData);
        setDuration(testData.durationMinutes || 60);
        setPassingMarks(testData.passingMarks || 0);
        setIsPublished(testData.isPublished || false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load test");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!test?._id) return;
    setIsSaving(true);
    try {
      await api.put(`/tests/${test._id}`, {
        durationMinutes: duration,
        passingMarks,
        isPublished
      });
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!qForm.text.trim()) { toast.error("Question text is required"); return; }
    if (!qForm.correctAnswer) { toast.error("Please mark the correct answer"); return; }
    
    if (qForm.type.startsWith("mcq")) {
      const emptyOption = qForm.options.find(o => !o.text.trim());
      if (emptyOption) { toast.error("Please fill all option texts"); return; }
    }

    setIsSaving(true);
    try {
      if (editingQuestionId) {
        await api.put(`/tests/${test._id}/questions/${editingQuestionId}`, qForm);
        toast.success("Question updated!");
      } else {
        await api.post(`/tests/${test._id}/questions`, qForm);
        toast.success("Question added!");
      }
      setShowModal(false);
      setEditingQuestionId(null);
      setQForm(initialForm);
      fetchTest();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/tests/${test._id}/questions/${qId}`);
      toast.success("Question deleted");
      fetchTest();
    } catch (error: any) {
      toast.error("Failed to delete question");
    }
  };

  const openEditModal = (q: any) => {
    setQForm({
      type: q.type,
      text: q.text,
      options: q.options || initialForm.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      difficulty: q.difficulty || "medium",
      explanation: q.explanation || ""
    });
    setEditingQuestionId(q._id);
    setShowModal(true);
  };

  if (isLoading) return <div className="p-8 text-center text-foreground-secondary">Loading Quiz Builder...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <Button variant="outline" size="icon"><ArrowLeft size={16} /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground-primary">
              Quiz Builder
            </h1>
            <p className="text-foreground-secondary">{test?.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {test?.isPublished && (
            <Link href={`/test/${test?._id}`} target="_blank">
              <Button variant="outline" leftIcon={<ExternalLink size={16} />}>Preview</Button>
            </Link>
          )}
          <Button onClick={saveSettings} disabled={isSaving} leftIcon={<Save size={16} />}>
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-4">
          <Card className="p-5 space-y-4 sticky top-24">
            <h3 className="font-bold flex items-center gap-2 border-b pb-2"><Settings size={18}/> Settings</h3>
            
            <div>
              <label className="text-sm font-semibold mb-1 block">Duration (Minutes)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-1 block">Passing Marks (0 = none)</label>
              <Input type="number" value={passingMarks} onChange={(e) => setPassingMarks(Number(e.target.value))} />
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="publish" 
                className="w-5 h-5 accent-brand-500 rounded" 
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)} 
              />
              <label htmlFor="publish" className="font-semibold cursor-pointer">Published to Students</label>
            </div>
            
            <div className="pt-4 border-t mt-4 text-sm text-foreground-secondary">
              <p>Total Questions: {test?.questions?.length || 0}</p>
              <p>Total Marks: {test?.questions?.reduce((acc: number, q: any) => acc + (q.marks || 0), 0) || 0}</p>
            </div>
          </Card>
        </div>

        {/* Questions List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
            <span className="font-bold">Questions ({test?.questions?.length || 0})</span>
            <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { setQForm(initialForm); setEditingQuestionId(null); setShowModal(true); }}>
              Add Question
            </Button>
          </div>

          <div className="space-y-3">
            {test?.questions?.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-foreground-secondary">
                No questions added yet. Click "Add Question" to start.
              </div>
            ) : (
              test?.questions?.map((q: any, i: number) => (
                <Card key={q._id} className="p-4 flex gap-3">
                  <div className="cursor-move text-gray-400 mt-1"><GripVertical size={20} /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold bg-brand-50 dark:bg-brand-900/30 text-brand-600 px-2 py-0.5 rounded">Q{i + 1}</span>
                      <div className="flex gap-2">
                        <span className="text-xs font-semibold text-green-600">+{q.marks}</span>
                        <span className="text-xs font-semibold text-red-600">-{q.negativeMarks}</span>
                      </div>
                    </div>
                    <p className="font-medium mb-3 whitespace-pre-wrap">{q.text}</p>
                    
                    {q.type.startsWith("mcq") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options?.map((opt: any) => (
                          <div key={opt.id} className={`p-2 rounded border text-sm flex gap-2 ${
                            (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt.id) : q.correctAnswer === opt.id) 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-800'
                          }`}>
                            <span className="font-bold">{opt.id}.</span> {opt.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {(q.type === "numerical" || q.type === "truefalse") && (
                      <div className="p-2 bg-green-50 text-green-700 rounded text-sm mb-3 font-semibold border border-green-200">
                        Answer: {q.correctAnswer}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(q)} leftIcon={<PenTool size={14} />}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(q._id)} className="text-red-500 hover:bg-red-50"><Trash2 size={14} /></Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col my-auto shadow-2xl">
            <div className="p-5 border-b font-bold text-lg sticky top-0 bg-white dark:bg-background-secondary z-10 flex justify-between">
              {editingQuestionId ? "Edit Question" : "Add New Question"}
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Question Type</label>
                  <select 
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-brand-500"
                    value={qForm.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      let newForm = { ...qForm, type };
                      if (type === "mcq-single") newForm.correctAnswer = "A";
                      if (type === "mcq-multiple") newForm.correctAnswer = ["A"];
                      if (type === "truefalse") newForm.correctAnswer = "True";
                      if (type === "numerical") newForm.correctAnswer = "";
                      setQForm(newForm);
                    }}
                  >
                    <option value="mcq-single">MCQ (Single Correct)</option>
                    <option value="mcq-multiple">MCQ (Multiple Correct)</option>
                    <option value="numerical">Numerical</option>
                    <option value="truefalse">True / False</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Difficulty</label>
                  <select 
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-brand-500"
                    value={qForm.difficulty}
                    onChange={(e) => setQForm({...qForm, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1 block">Question Text</label>
                <textarea 
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-500 min-h-[100px]"
                  placeholder="Enter the question text here..."
                  value={qForm.text}
                  onChange={(e) => setQForm({...qForm, text: e.target.value})}
                />
              </div>

              {/* Options for MCQ */}
              {qForm.type.startsWith("mcq") && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold block">Options & Correct Answer</label>
                  {qForm.options.map((opt, idx) => (
                    <div key={opt.id} className="flex gap-3 items-center">
                      <div className="flex items-center justify-center w-8 h-8 font-bold bg-gray-100 rounded">{opt.id}</div>
                      <Input 
                        placeholder={`Option ${opt.id}`} 
                        value={opt.text}
                        className="flex-1"
                        onChange={(e) => {
                          const newOpts = [...qForm.options];
                          newOpts[idx].text = e.target.value;
                          setQForm({...qForm, options: newOpts});
                        }}
                      />
                      <input 
                        type={qForm.type === "mcq-single" ? "radio" : "checkbox"}
                        name="correctAnswer"
                        className="w-5 h-5 accent-brand-500 cursor-pointer"
                        checked={qForm.type === "mcq-single" ? qForm.correctAnswer === opt.id : (qForm.correctAnswer as string[]).includes(opt.id)}
                        onChange={(e) => {
                          if (qForm.type === "mcq-single") {
                            setQForm({...qForm, correctAnswer: opt.id});
                          } else {
                            const currentArr = Array.isArray(qForm.correctAnswer) ? [...qForm.correctAnswer] : [];
                            if (e.target.checked) currentArr.push(opt.id);
                            else {
                              const idx = currentArr.indexOf(opt.id);
                              if(idx > -1) currentArr.splice(idx, 1);
                            }
                            setQForm({...qForm, correctAnswer: currentArr});
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Input for Numerical */}
              {qForm.type === "numerical" && (
                <div>
                  <label className="text-sm font-semibold mb-1 block">Correct Answer (Number/Value)</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. 9.8" 
                    value={qForm.correctAnswer}
                    onChange={(e) => setQForm({...qForm, correctAnswer: e.target.value})}
                  />
                </div>
              )}

              {/* Select for True/False */}
              {qForm.type === "truefalse" && (
                <div>
                  <label className="text-sm font-semibold mb-1 block">Correct Answer</label>
                  <select 
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-brand-500"
                    value={qForm.correctAnswer}
                    onChange={(e) => setQForm({...qForm, correctAnswer: e.target.value})}
                  >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-sm font-semibold mb-1 block text-green-600">Marks (Positive)</label>
                  <Input type="number" value={qForm.marks} onChange={(e) => setQForm({...qForm, marks: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-red-600">Negative Marks</label>
                  <Input type="number" value={qForm.negativeMarks} onChange={(e) => setQForm({...qForm, negativeMarks: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1 block">Explanation (Optional)</label>
                <textarea 
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-500 min-h-[80px]"
                  placeholder="Explain the solution..."
                  value={qForm.explanation}
                  onChange={(e) => setQForm({...qForm, explanation: e.target.value})}
                />
              </div>

            </div>
            <div className="p-5 border-t bg-gray-50 dark:bg-gray-800/30 sticky bottom-0 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSaveQuestion} disabled={isSaving}>
                {isSaving ? "Saving..." : editingQuestionId ? "Update Question" : "Save Question"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
