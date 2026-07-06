import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User";
import { Course } from "./models/Course";
import { hashPassword } from "./utils/auth";
import connectDB from "./config/db";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing users and courses...");
    await User.deleteMany({});
    await Course.deleteMany({});

    console.log("Hashing passwords...");
    const adminPassword = await hashPassword("admin@123");
    const facultyPassword = await hashPassword("faculty@123");
    const studentPassword = await hashPassword("student@123");
    const parentPassword = await hashPassword("parent@123");

    console.log("Creating default users...");
    const users = await User.insertMany([
      {
        name: "System Admin",
        email: "admin@shiksha.com",
        phone: "1111111111",
        passwordHash: adminPassword,
        role: "admin",
      },
      {
        name: "Instructor Rahul",
        email: "faculty@shiksha.com",
        phone: "2222222222",
        passwordHash: facultyPassword,
        role: "faculty",
      },
      {
        name: "Student Anil",
        email: "student@shiksha.com",
        phone: "3333333333",
        passwordHash: studentPassword,
        role: "student",
      },
      {
        name: "Parent Sunita",
        email: "parent@shiksha.com",
        phone: "4444444444",
        passwordHash: parentPassword,
        role: "parent",
      }
    ]);

    console.log(`Successfully seeded ${users.length} users.`);
    
    // We can also create a dummy course for the faculty to have something in the catalog
    console.log("Creating a sample course...");
    const facultyUser = users.find(u => u.role === "faculty");
    if (facultyUser) {
      await Course.create({
        title: "Complete JEE Advanced Physics",
        slug: "complete-jee-advanced-physics",
        description: "Master Mechanics, Electromagnetism, and Optics for JEE Advanced.",
        category: "JEE Advanced",
        level: "Class 12",
        instructor: facultyUser._id,
        price: 4999,
        discountPrice: 2999,
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
        isPublished: true
      });
      console.log("Successfully seeded sample course.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
