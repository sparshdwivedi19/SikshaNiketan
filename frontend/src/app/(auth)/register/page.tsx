"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Phone, User as UserIcon, ArrowRight, ShieldCheck, GraduationCap, Users, UserCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const { login, setLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (response.data.status === "success") {
        login(response.data.user, response.data.token);
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else if (err.request) {
        setError("Network Connection Error: Server unreachable.");
      } else {
        setError("Registration failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      <div className="mb-6">
        <h2 className="text-3xl font-black font-heading text-white mb-1.5">Create Account</h2>
        <p className="text-slate-400 text-sm font-medium">Join 150,000+ aspirants on Shiksha Niketan.</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">I am joining as a</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "student", label: "Student", icon: <GraduationCap size={16} /> },
              { id: "faculty", label: "Faculty", icon: <UserCheck size={16} /> },
              { id: "parent", label: "Parent", icon: <Users size={16} /> },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  formData.role === r.id
                    ? "bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo/20"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {r.icon}
                <span className="mt-1">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Full Name</label>
          <Input
            name="name"
            type="text"
            placeholder="Aarav Sharma"
            value={formData.name}
            onChange={handleChange}
            leftIcon={<UserIcon size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address</label>
          <Input
            name="email"
            type="email"
            placeholder="student@shikshaniketan.com"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Phone Number</label>
          <Input
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={<Phone size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            leftIcon={<Lock size={18} className="text-indigo-400" />}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500"
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
          Create Account
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-slate-400 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
