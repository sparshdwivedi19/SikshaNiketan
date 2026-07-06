import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-brand-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-700/50 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white text-brand-600 flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight">
              Shiksha<span className="text-brand-300">Niketan</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold font-heading leading-tight mb-4">
            Join the ecosystem of <br/> future achievers.
          </h1>
          <p className="text-brand-200 max-w-md">
            Unlock premium content, personalized AI guidance, and track your progress daily. Your journey to the top rank starts here.
          </p>
        </div>

        <div className="relative z-10 text-sm text-brand-400">
          © {new Date().getFullYear()} Shiksha Niketan.
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center gap-2 justify-center mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight text-foreground-primary">
              Shiksha<span className="text-brand-600">Niketan</span>
            </span>
          </Link>
          
          {children}
        </div>
      </div>
    </div>
  );
}
