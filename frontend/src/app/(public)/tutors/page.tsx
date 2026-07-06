"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, Search } from "lucide-react";

export default function TutorsPage() {
  const [subjectQuery, setSubjectQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const dummyTutors = [
    { id: 1, name: "Arjun Sharma", subject: "Mathematics", location: "Noida", rating: 4.9, rate: "₹500/hr" },
    { id: 2, name: "Priya Singh", subject: "Physics", location: "Online", rating: 4.8, rate: "₹600/hr" },
    { id: 3, name: "Rahul Verma", subject: "Chemistry", location: "Delhi", rating: 4.7, rate: "₹450/hr" },
  ];

  const filteredTutors = dummyTutors.filter(tutor => {
    const matchesSubject = tutor.subject.toLowerCase().includes(subjectQuery.toLowerCase()) || 
                           tutor.name.toLowerCase().includes(subjectQuery.toLowerCase());
    const matchesLocation = tutor.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSubject && matchesLocation;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold font-heading mb-4 text-foreground-primary">Find the Perfect Home Tutor</h1>
        <p className="text-foreground-secondary">
          Browse verified, highly-rated tutors for personalized 1-on-1 learning at your home or online.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex w-full max-w-3xl bg-white dark:bg-background-secondary rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-2">
          <div className="flex-1 flex items-center px-4 border-r border-gray-200 dark:border-gray-700">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Subject or Grade" 
              className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-foreground-primary" 
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center px-4">
            <MapPin className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Location or Online" 
              className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-foreground-primary" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl shrink-0">
                {tutor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground-primary">{tutor.name}</h3>
                <p className="text-brand-600 font-medium text-sm">{tutor.subject}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-foreground-secondary">
                  <MapPin size={14} /> {tutor.location}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1">
                <Star className="text-accent-500 fill-accent-500" size={16} />
                <span className="font-bold text-foreground-primary">{tutor.rating}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground-primary">{tutor.rate}</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">Book Trial Class</Button>
          </Card>
        ))
        ) : (
          <div className="col-span-full py-12 text-center text-foreground-secondary">
            <p className="text-lg">No tutors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
