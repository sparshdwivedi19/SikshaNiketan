import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

// Extend Request to carry user info
export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ status: "error", message: "Not authorized. No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Not authorized. Invalid or expired token." });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ status: "error", message: "Forbidden. You do not have permission to perform this action." });
      return;
    }
    next();
  };
};
