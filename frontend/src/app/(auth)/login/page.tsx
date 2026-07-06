"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, LogIn } from "lucide-react";
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
        setError(err.response.data.message || "Invalid credentials.");
      } else if (err.request) {
        setError("Network Error: Could not connect to the backend server. Is it running?");
      } else {
        setError("Login failed: " + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading text-foreground-primary mb-2">Welcome Back</h2>
        <p className="text-foreground-secondary">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={18} />}
          required
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
          />
          <Link href="/forgot-password" className="text-sm text-brand-600 font-medium self-end hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading} rightIcon={!isLoading && <LogIn size={18} />}>
          Log In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-foreground-secondary">
        Don't have an account?{" "}
        <Link href="/register" className="text-brand-700 font-bold hover:underline">
          Sign up now
        </Link>
      </div>
    </div>
  );
}
