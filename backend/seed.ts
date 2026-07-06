import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, UserRole } from "./src/models/User";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shikshaniketan");
    console.log("Connected to MongoDB for seeding...");

    const usersToSeed = [
      { name: "System Admin", email: "admin@shiksha.com", phone: "1111111111", password: "admin@123", role: "admin" as UserRole },
      { name: "Faculty Member", email: "faculty@shiksha.com", phone: "2222222222", password: "faculty@123", role: "faculty" as UserRole },
      { name: "Student User", email: "student@shiksha.com", phone: "3333333333", password: "student@123", role: "student" as UserRole },
      { name: "Parent User", email: "parent@shiksha.com", phone: "4444444444", password: "parent@123", role: "parent" as UserRole }
    ];

    for (const user of usersToSeed) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, passwordHash });
        console.log(`Seeded user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
