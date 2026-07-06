"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Filter, BookOpen, Star, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  instructor: { name: string; avatar?: string };
  ratings: { avg: number; count: number };
  enrollmentCount: number;
  isPublished: boolean;
}

const CATEGORIES = ["JEE Main & Advanced", "NEET UG", "Foundation (Class 6-10)", "Skill Development"];
const PRICE_RANGES = ["Free", "Under ₹1,000", "₹1,000 - ₹3,000", "Above ₹3,000"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/courses");
        if (response.data.status === "success") {
          setCourses(response.data.courses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    if (selectedCategories.length > 0) {
      const catMap: Record<string, string> = {
        "JEE Main & Advanced": "JEE",
        "NEET UG": "NEET",
        "Foundation (Class 6-10)": "Foundation",
        "Skill Development": "Skills",
      };
      const matchesCategory = selectedCategories.some(
        (cat) => course.category.toLowerCase().includes(catMap[cat]?.toLowerCase() || cat.toLowerCase())
      );
      if (!matchesCategory) return false;
    }

    if (selectedPrices.length > 0) {
      const priceVal = course.discountPrice || course.price;
      const matchesPrice = selectedPrices.some((range) => {
        if (range === "Free") return priceVal === 0;
        if (range === "Under ₹1,000") return priceVal > 0 && priceVal < 1000;
        if (range === "₹1,000 - ₹3,000") return priceVal >= 1000 && priceVal <= 3000;
        if (range === "Above ₹3,000") return priceVal > 3000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    if (minRating !== null && (course.ratings?.avg || 0) < minRating) return false;
    return true;
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const togglePrice = (price: string) => {
    setSelectedPrices((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]));
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading text-foreground-primary mb-2">Explore Courses</h1>
          <p className="text-foreground-secondary">
            {isLoading ? "Loading courses..." : `${courses.length} courses available`}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            rightIcon={<Filter size={18} />}
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {(showFilters || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className={`w-full lg:w-64 shrink-0 space-y-6 ${!showFilters && "hidden lg:block"}`}
            >
              <div className="space-y-4">
                <h3 className="font-bold text-foreground-primary">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <span className="text-sm text-foreground-secondary group-hover:text-foreground-primary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-foreground-primary">Price Range</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((price) => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(price)}
                        onChange={() => togglePrice(price)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <span className="text-sm text-foreground-secondary group-hover:text-foreground-primary transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-foreground-primary">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <span className="flex items-center gap-1 text-sm text-foreground-secondary group-hover:text-foreground-primary transition-colors">
                        {rating} <Star size={14} className="text-yellow-400 fill-yellow-400" /> & up
                      </span>
                    </label>
                  ))}
                  {minRating !== null && (
                    <button onClick={() => setMinRating(null)} className="text-xs text-brand-600 font-medium mt-2 hover:underline">
                      Clear Rating Filter
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link href={`/courses/${course.slug}`} key={course._id}>
                  <Card variant="default" className="group cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 h-full flex flex-col hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-video w-full shrink-0 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 z-10">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        {course.ratings?.avg?.toFixed(1) || "New"}
                      </div>
                      <div className="w-full h-full flex items-center justify-center text-brand-500">
                        <BookOpen size={48} className="opacity-20 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-4 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md">
                          {course.category}
                        </span>
                        <span className="text-xs text-foreground-secondary font-medium">{course.level}</span>
                      </div>
                      <h3 className="font-semibold text-foreground-primary leading-tight line-clamp-2 flex-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-foreground-secondary">
                        By {course.instructor?.name || "Shiksha Niketan"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-foreground-secondary">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {course.enrollmentCount || 0} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" /> {course.ratings?.count || 0} reviews
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1">
                          {course.discountPrice ? (
                            <>
                              <span className="font-bold text-lg text-foreground-primary flex items-center">
                                <IndianRupee size={14} />{course.discountPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-foreground-secondary line-through ml-1">
                                ₹{course.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-lg text-foreground-primary flex items-center">
                              <IndianRupee size={14} />{course.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                          View Course
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <Search className="text-gray-800" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground-primary mb-2">No courses found</h2>
              <p className="text-foreground-secondary max-w-md">Try adjusting your filters or search terms.</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setSelectedPrices([]);
                  setMinRating(null);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
