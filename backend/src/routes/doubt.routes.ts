import { Router } from "express";
import { createDoubt, getDoubts, getMyDoubts, answerDoubt } from "../controllers/doubt.controller";
import { protect, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createDoubt);
router.get("/", protect, getDoubts);
router.get("/my", protect, getMyDoubts);
router.put("/:id/answer", protect, requireRole("faculty", "admin"), answerDoubt);

export default router;
