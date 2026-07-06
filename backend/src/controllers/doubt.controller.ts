import { Response } from "express";
import { Doubt } from "../models/Doubt";
import { AuthRequest } from "../middleware/auth.middleware";

// POST /api/v1/doubts — Submit a doubt
export const createDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, courseId } = req.body;
    if (!title || !description) {
      res.status(400).json({ status: "error", message: "Title and description are required." });
      return;
    }
    const doubt = await Doubt.create({
      student: req.user!.id,
      title,
      description,
      course: courseId || undefined,
    });
    const populated = await doubt.populate("student", "name avatar");
    res.status(201).json({ status: "success", doubt: populated });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/doubts — Get all doubts (paginated)
export const getDoubts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const doubts = await Doubt.find({})
      .populate("student", "name avatar")
      .populate("answeredBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doubt.countDocuments({});

    res.status(200).json({ status: "success", count: doubts.length, total, doubts });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/v1/doubts/my — Get logged-in student's own doubts
export const getMyDoubts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doubts = await Doubt.find({ student: req.user!.id })
      .populate("answeredBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", count: doubts.length, doubts });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PUT /api/v1/doubts/:id/answer — Answer a doubt (instructor/admin)
export const answerDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    if (!answer) {
      res.status(400).json({ status: "error", message: "Answer is required." });
      return;
    }
    const doubt = await Doubt.findByIdAndUpdate(
      id,
      { answer, answeredBy: req.user!.id, answeredAt: new Date(), status: "answered" },
      { new: true }
    ).populate("answeredBy", "name");

    if (!doubt) {
      res.status(404).json({ status: "error", message: "Doubt not found." });
      return;
    }
    res.status(200).json({ status: "success", doubt });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
