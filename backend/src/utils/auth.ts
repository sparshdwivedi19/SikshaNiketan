import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: Types.ObjectId | string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
