"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, UserPlus, Phone, User as UserIcon, ArrowRight } from "lucide-react";
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
        // Backend returned an error response (e.g. 400 Duplicate User)
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else if (err.request) {
        // Request was made but no response received (Backend down / CORS)
        setError("Network Error: Could not connect to the backend server. Is it running?");
      } else {
        // Something else happened
        setError("Registration failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading text-foreground-primary mb-2">Create Account</h2>
        <p className="text-foreground-secondary">Join Shiksha Niketan and start your journey.</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          leftIcon={<UserIcon size={18} />}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Mail size={18} />}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+91 9876543210"
          value={formData.phone}
          onChange={handleChange}
          leftIcon={<Phone size={18} />}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock size={18} />}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground-primary">Register As</label>
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-background-secondary px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option className="text-gray-900 dark:text-gray-100" value="student">Student</option>
            <option className="text-gray-900 dark:text-gray-100" value="faculty">Faculty / Instructor</option>
            <option className="text-gray-900 dark:text-gray-100" value="parent">Parent</option>
          </select>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading} rightIcon={!isLoading && <ArrowRight size={18} />}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-foreground-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 font-bold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
