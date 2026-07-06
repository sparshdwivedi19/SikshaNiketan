import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      res.status(400).json({ status: "error", message: "User with this email or phone already exists." });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      role,
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ status: "error", message: "Invalid email or password." });
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ status: "error", message: "Invalid email or password." });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
