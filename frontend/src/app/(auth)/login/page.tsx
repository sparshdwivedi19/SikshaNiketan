"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.status === "success") {
        login(response.data.user, response.data.token);
        
        const userRole = response.data.user.role;
        if (userRole === "instructor" || userRole === "faculty" || userRole === "tutor") {
          router.push("/instructor");
        } else if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "parent") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard/student");
        }
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password.");
      } else if (err.request) {
        setError("Network Connection Error: Server unreachable.");
      } else {
        setError("Login failed: " + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-black font-heading text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400 text-sm font-medium">Enter your credentials to access your portal.</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address</label>
          <Input
            type="email"
            placeholder="student@shikshaniketan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-indigo-400 font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-indigo-500"
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
          Sign In
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-slate-400 font-medium">
        New to Shiksha Niketan?{" "}
        <Link href="/register" className="text-indigo-400 font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
