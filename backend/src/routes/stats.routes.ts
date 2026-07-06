import { Router } from "express";
import { getAdminStats, getInstructorStats, getLeaderboard } from "../controllers/stats.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/admin", protect, requireRole("admin"), getAdminStats);
router.get("/instructor", protect, requireRole("faculty", "admin"), getInstructorStats);
router.get("/leaderboard", protect, getLeaderboard);

export default router;
