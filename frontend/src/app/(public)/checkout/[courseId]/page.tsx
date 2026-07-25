"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Mail, Phone, MapPin, Sparkles, Tag, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    state: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    if (couponCode.toUpperCase() === "TOPPER50" || couponCode.toUpperCase() === "SNAT2026") {
      setCouponApplied(true);
      toast.success("Coupon code applied! Extra ₹500 discount added.");
    } else {
      toast.error("Invalid coupon code. Try TOPPER50 or SNAT2026");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to complete your purchase.");
      router.push("/login");
      return;
    }

    if (!formData.firstName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required billing fields.");
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsProcessing(false);
    setIsSuccess(true);
    toast.success("Payment successful! Welcome to the batch.");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-28 pb-24 text-white flex items-center justify-center relative overflow-hidden">
        <BackgroundGlow />
        <div className="max-w-md w-full p-8 rounded-3xl glass-card-dark border border-white/15 text-center flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-3xl font-black font-heading text-white mb-2">Payment Successful!</h2>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed font-medium">
            Your enrollment is confirmed. Head to your student dashboard to access live classes and CBT tests.
          </p>
          <Link href="/dashboard/student/courses" className="w-full">
            <Button variant="primary" className="w-full h-12 rounded-xl font-bold">Go to My Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const basePrice = 2999;
  const discount = couponApplied ? 1000 : 500;
  const gst = Math.round((basePrice - discount) * 0.18);
  const total = basePrice - discount + gst;

  return (
    <div className="relative min-h-screen pt-28 pb-24 text-white overflow-hidden">
      <BackgroundGlow />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            Frictionless Checkout
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white mt-2">
            Complete Batch Enrollment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Billing Details & Payment Gateway */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <Mail size={20} className="text-indigo-400" /> Student & Billing Information
              </h3>
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">First Name *</label>
                    <Input name="firstName" placeholder="Aarav" value={formData.firstName} onChange={handleChange} className="bg-slate-950/80 border-slate-800 text-white rounded-xl" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Last Name</label>
                    <Input name="lastName" placeholder="Sharma" value={formData.lastName} onChange={handleChange} className="bg-slate-950/80 border-slate-800 text-white rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address *</label>
                  <Input name="email" type="email" placeholder="student@shikshaniketan.com" value={formData.email} onChange={handleChange} leftIcon={<Mail size={18} className="text-indigo-400" />} className="bg-slate-950/80 border-slate-800 text-white rounded-xl" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Phone Number *</label>
                  <Input name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} leftIcon={<Phone size={18} className="text-indigo-400" />} className="bg-slate-950/80 border-slate-800 text-white rounded-xl" required />
                </div>
              </form>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-black text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <CreditCard size={20} className="text-indigo-400" /> Select Payment Method
              </h3>
              <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-indigo-500 bg-white" />
                  <span className="font-bold text-white text-sm">Instant UPI / Razorpay Gateway</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Zero Convenience Fee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl sticky top-28 backdrop-blur-2xl">
              <h3 className="text-xl font-black text-white mb-6">Order Summary</h3>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 mb-6">
                <h4 className="font-bold text-base text-white mb-1">JEE Main & Advanced Pinnacle 2027</h4>
                <p className="text-xs text-slate-400">Live Lectures + CBT Test Series + AI Co-Pilot</p>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6">
                <Input
                  placeholder="Coupon code (TOPPER50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-white rounded-xl text-xs"
                />
                <Button variant="outline" size="sm" type="submit" className="rounded-xl border-white/20 text-white shrink-0">
                  Apply
                </Button>
              </form>

              {/* Calculation Rows */}
              <div className="space-y-3 text-sm text-slate-300 border-b border-white/10 pb-4 mb-4 font-medium">
                <div className="flex justify-between">
                  <span>Batch Fee</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-white text-base">Total Payable</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Button
                variant="primary"
                className="w-full h-14 rounded-2xl font-bold text-base shadow-neon-indigo"
                type="submit"
                form="checkout-form"
                isLoading={isProcessing}
                rightIcon={<ArrowRight size={18} />}
              >
                {isProcessing ? "Processing Securely..." : `Proceed to Pay ₹${total.toLocaleString()}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4 font-semibold">
                <ShieldCheck size={16} className="text-emerald-400" /> 256-Bit SSL Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
