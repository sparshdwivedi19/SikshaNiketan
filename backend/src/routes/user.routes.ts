import { Router } from "express";
import { getAllUsers, getMe, updateMe, toggleUserStatus } from "../controllers/user.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, requireRole("admin"), getAllUsers);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.patch("/:id/toggle-status", protect, requireRole("admin"), toggleUserStatus);

export default router;
