"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Send, MessageSquare, Star } from "lucide-react";
import { toast } from "react-hot-toast";

const teachers = [
  { id: 1, name: "Mr. Rajesh Sharma", subject: "Physics", rating: 4.9, experience: "12 years", avatar: "R" },
  { id: 2, name: "Ms. Priya Mehta", subject: "Chemistry", rating: 4.8, experience: "8 years", avatar: "P" },
  { id: 3, name: "Mr. Anil Verma", subject: "Mathematics", rating: 4.7, experience: "15 years", avatar: "A" },
];

export default function ParentTeachersPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please type a message.");
      return;
    }
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSending(false);
    toast.success("Message sent! The teacher will respond within 24 hours.");
    setMessage("");
    setSelectedTeacher(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground-primary mb-1 flex items-center gap-3">
          <Users size={28} className="text-brand-500" /> Teacher Connect
        </h1>
        <p className="text-foreground-secondary">Reach out to your child's teachers directly.</p>
      </div>

      <div className="space-y-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold text-lg shrink-0">
                  {teacher.avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground-primary">{teacher.name}</p>
                  <p className="text-sm text-foreground-secondary">{teacher.subject} • {teacher.experience} experience</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-foreground-secondary">{teacher.rating}</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant={selectedTeacher === teacher.id ? "default" : "outline"}
                onClick={() => setSelectedTeacher(selectedTeacher === teacher.id ? null : teacher.id)}
                leftIcon={<MessageSquare size={14} />}
              >
                Message
              </Button>
            </div>

            {selectedTeacher === teacher.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-foreground-primary mb-2">
                  Message {teacher.name}
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Write your message to ${teacher.name}...`}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-background-secondary px-4 py-3 text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedTeacher(null)}>Cancel</Button>
                  <Button size="sm" isLoading={isSending} onClick={handleSendMessage} leftIcon={!isSending ? <Send size={14} /> : undefined}>
                    Send
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
