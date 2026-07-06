import { Request, Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/v1/users — Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select("-passwordHash").sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      count: users.length,
      data: { users },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/users/me — Get current user's profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select("-passwordHash");
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }
    res.status(200).json({ status: "success", user });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PUT /api/v1/users/me — Update current user's profile
export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Prevent password and role updates through this route
    const { name, phone, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }
    res.status(200).json({ status: "success", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// PATCH /api/v1/users/:id/toggle-status — Toggle user active status (admin)
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ status: "success", message: `User ${user.isActive ? "activated" : "deactivated"}.`, user });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
