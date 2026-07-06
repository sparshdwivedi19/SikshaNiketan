"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageSquare, Plus, CheckCircle2, Clock, Search, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";

interface Doubt {
  _id: string;
  title: string;
  description: string;
  status: "open" | "answered" | "closed";
  answer?: string;
  answeredBy?: { name: string };
  createdAt: string;
}

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doubts/my");
      if (response.data.status === "success") {
        setDoubts(response.data.doubts);
      }
    } catch (error) {
      console.error("Failed to fetch doubts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill both title and description.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/doubts", formData);
      toast.success("Doubt submitted! Faculty will respond soon.");
      setFormData({ title: "", description: "" });
      setShowForm(false);
      fetchDoubts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit doubt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoubts = doubts.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig = {
    open: { label: "Open", bg: "bg-amber-100 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", icon: <Clock size={12} /> },
    answered: { label: "Answered", bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", icon: <CheckCircle2 size={12} /> },
    closed: { label: "Closed", bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", icon: <X size={12} /> },
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1">Doubts Forum</h1>
          <p className="text-foreground-secondary">Ask questions and get answers from faculty.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} leftIcon={<Plus size={18} />}>
          {showForm ? "Cancel" : "Ask a Doubt"}
        </Button>
      </div>

      {/* Submit Doubt Form */}
      {showForm && (
        <Card className="p-6 border-2 border-brand-200 dark:border-brand-800">
          <h3 className="text-lg font-bold font-heading text-foreground-primary mb-4">Submit New Doubt</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Doubt Title *"
              placeholder="e.g., How to solve integration by parts?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground-primary">Description *</label>
              <textarea
                placeholder="Describe your doubt in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-background-secondary px-4 py-3 text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Doubt"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your doubts..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Doubts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredDoubts.length > 0 ? (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => {
            const status = statusConfig[doubt.status];
            return (
              <Card key={doubt._id} className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-lg text-foreground-primary leading-tight">{doubt.title}</h3>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${status.bg} ${status.text}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">{doubt.description}</p>

                {doubt.status === "answered" && doubt.answer && (
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 mt-3">
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Answer by {doubt.answeredBy?.name || "Faculty"}
                    </p>
                    <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">{doubt.answer}</p>
                  </div>
                )}

                <p className="text-xs text-foreground-secondary mt-3">
                  Asked on {new Date(doubt.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={36} className="text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground-primary mb-2">No Doubts Yet</h2>
          <p className="text-foreground-secondary mb-6">Ask your first doubt and get help from expert faculty.</p>
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={18} />}>Ask Your First Doubt</Button>
        </div>
      )}
    </div>
  );
}
