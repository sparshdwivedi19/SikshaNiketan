"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to complete your purchase.");
      router.push("/login");
      return;
    }

    if (!formData.firstName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay flow — in production this would open Razorpay checkout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    toast.success("Payment successful! Welcome to the course.");
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground-primary mb-2">Payment Successful!</h2>
          <p className="text-foreground-secondary mb-8">
            You are now enrolled in the course. Head to your dashboard to start learning.
          </p>
          <Link href="/dashboard/student/courses" className="w-full">
            <Button className="w-full">Go to My Courses</Button>
          </Link>
          <Link href="/courses" className="mt-3 w-full">
            <Button variant="outline" className="w-full">Browse More Courses</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground-primary">Secure Checkout</h1>
        <p className="text-foreground-secondary flex items-center gap-2 mt-2">
          <Lock size={16} /> 100% Secure Payment via Razorpay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Billing Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-foreground-primary mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              Billing Information
            </h3>
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name *" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                <Input label="Last Name" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
              </div>
              <Input label="Email Address *" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} leftIcon={<Mail size={18} />} required />
              <Input label="Phone Number *" name="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} leftIcon={<Phone size={18} />} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="State" name="state" placeholder="Maharashtra" value={formData.state} onChange={handleChange} />
                <Input label="City" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} />
              </div>
            </form>
          </Card>

          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-foreground-primary mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              Payment Method
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border border-brand-500 bg-brand-50 dark:bg-brand-900/10 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" className="w-5 h-5 accent-brand-600" defaultChecked />
                  <span className="font-bold text-brand-900 dark:text-brand-200">Razorpay (UPI / Cards / NetBanking)</span>
                </div>
                <CreditCard className="text-brand-600" />
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-bold text-foreground-primary mb-6">Order Summary</h3>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-sm text-foreground-primary leading-tight mb-1">
                JEE Advanced Physics — Complete Course
              </h4>
              <p className="text-xs text-foreground-secondary">Lifetime access • Certificate included</p>
            </div>

            <div className="space-y-3 text-sm text-foreground-secondary border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Original Price</span>
                <span className="line-through">₹4,999</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount (40% OFF)</span>
                <span>-₹2,000</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹2,999</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹540</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-foreground-primary">Total Amount</span>
              <span className="text-2xl font-bold text-foreground-primary font-heading">₹3,539</span>
            </div>

            <Button
              className="w-full mb-4 py-6 text-lg"
              type="submit"
              form="checkout-form"
              isLoading={isProcessing}
            >
              {isProcessing ? "Processing Securely..." : "Proceed to Pay ₹3,539"}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-foreground-secondary">
              <ShieldCheck size={16} className="text-green-500" />
              30-Day Money-Back Guarantee
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
