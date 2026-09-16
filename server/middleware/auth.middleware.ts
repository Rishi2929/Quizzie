import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ErrorHandler from "./error.middleware.js";

interface JwtPayload {
  userId: string;
  email: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ErrorHandler("Authentication failed", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findOne({
      _id: decoded.userId,
      email: decoded.email,
    });

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log("isAuthenticated error:", error);
    next(error);
  }
};
