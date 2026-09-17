import type { Request, Response, NextFunction } from "express";
import userService from "../services/user.service.js";

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 15 * 60 * 1000,
  path: "/",
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await userService.createUser(req.body);

    res
      .cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
      .cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .status(201)
      .json({
        success: true,
        data: {
          user: result.user,
        },
      });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log("Controller");

    const result = await userService.loginUser(req.body);

    res
      .cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
      .cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .status(200)
      .json({
        success: true,
        data: {
          user: result.user,
        },
      });
  } catch (error) {
    next(error);
  }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}
