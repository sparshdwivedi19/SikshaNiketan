"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const role = user?.role;
    if (role === "faculty" || role === "instructor" || role === "tutor") {
      router.replace("/instructor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "parent") {
      router.replace("/dashboard/parent");
    } else {
      router.replace("/dashboard/student");
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
