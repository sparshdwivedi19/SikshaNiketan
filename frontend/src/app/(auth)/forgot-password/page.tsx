"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="w-full text-white">
      {submitted ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black font-heading text-white mb-2">Check Your Inbox</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            We sent a password reset link to <strong className="text-indigo-400 font-semibold">{email}</strong>.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full h-11 rounded-xl border-white/20 text-white" leftIcon={<ArrowLeft size={18} />}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Link href="/login" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
            <h2 className="text-3xl font-black font-heading text-white mb-1.5">Reset Password</h2>
            <p className="text-slate-300 text-sm font-medium">Enter your registered email address to receive a recovery link.</p>
          </div>

          <form onSubmit={handleReset} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200">Email Address</label>
              <Input
                type="email"
                placeholder="student@shikshaniketan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} className="text-indigo-400" />}
                className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-400 h-12 rounded-xl focus:border-indigo-500"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full h-12 rounded-xl mt-2 font-bold text-base"
              isLoading={isLoading}
              rightIcon={!isLoading && <ArrowRight size={18} />}
            >
              Send Recovery Link
            </Button>
          </form>

          <p className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-300 font-medium">
            Remembered your password?{" "}
            <Link href="/login" className="text-indigo-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
