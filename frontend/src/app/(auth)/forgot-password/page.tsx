"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    // Simulate — would call /api/v1/auth/forgot-password in production
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-8">
        {submitted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground-primary mb-2">Check Your Email</h1>
            <p className="text-foreground-secondary mb-6">
              If an account with <strong>{email}</strong> exists, we have sent you a password reset link.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full" leftIcon={<ArrowLeft size={18} />}>
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link href="/login" className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-brand-600 transition-colors mb-6">
                <ArrowLeft size={16} /> Back to Login
              </Link>
              <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-2">Forgot Password?</h1>
              <p className="text-foreground-secondary">Enter your email address and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-foreground-secondary">
              Remember your password?{" "}
              <Link href="/login" className="text-brand-600 font-bold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
