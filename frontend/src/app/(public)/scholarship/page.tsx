"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Trophy, Clock, CheckCircle2, Mail, Phone, User as UserIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ScholarshipPage() {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    targetExam: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    // Simulate registration — in production this calls /api/v1/scholarship
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Registration successful! You will receive a confirmation email shortly.");
  };

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <Trophy size={48} className="mx-auto mb-6 text-brand-300" />
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            National Level Scholarship Test (NLST) 2026
          </h1>
          <p className="text-lg text-brand-100 mb-8">
            Get up to 100% scholarship on all classroom and online programs. Identify your true potential and compete with lakhs of students nationwide.
          </p>
          <Button
            size="lg"
            className="bg-white text-brand-900 hover:bg-brand-50 w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            Register for Free
          </Button>
          <p className="text-sm mt-4 text-brand-300">Next test every Sunday, 10:00 AM IST</p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-8">
            <Trophy className="mx-auto mb-4 text-brand-500" size={32} />
            <h3 className="text-xl font-bold mb-2">Up to 100% Scholarship</h3>
            <p className="text-foreground-secondary text-sm">Merit-based fee waivers for top performing students across all courses.</p>
          </Card>
          <Card className="text-center p-8">
            <Clock className="mx-auto mb-4 text-brand-500" size={32} />
            <h3 className="text-xl font-bold mb-2">Flexible Timings</h3>
            <p className="text-foreground-secondary text-sm">Choose a slot that fits your schedule. Tests available online and offline.</p>
          </Card>
          <Card className="text-center p-8">
            <CheckCircle2 className="mx-auto mb-4 text-brand-500" size={32} />
            <h3 className="text-xl font-bold mb-2">Detailed Analysis</h3>
            <p className="text-foreground-secondary text-sm">Get AI-driven insights into your strong and weak topics immediately after the test.</p>
          </Card>
        </div>
      </section>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-background-secondary rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} className="text-foreground-secondary" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground-primary mb-2">You're Registered!</h3>
                <p className="text-foreground-secondary mb-6">
                  We'll send you the test link and instructions to <strong>{formData.email}</strong> before the exam.
                </p>
                <Button className="w-full" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold font-heading text-foreground-primary mb-2">Register for NLST 2026</h3>
                <p className="text-foreground-secondary text-sm mb-6">Fill in your details to secure your slot.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<UserIcon size={18} />}
                    required
                  />
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone size={18} />}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground-primary">Target Exam</label>
                    <select
                      name="targetExam"
                      value={formData.targetExam}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-background-secondary px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <option value="">Select exam</option>
                      <option value="JEE">JEE Main & Advanced</option>
                      <option value="NEET">NEET UG</option>
                      <option value="Foundation">Foundation (Class 8-10)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Register — It's Free!"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
