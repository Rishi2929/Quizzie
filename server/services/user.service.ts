import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import ErrorHandler from "../middleware/error.middleware.js";

class UserService {
  async createUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ErrorHandler("User Already Exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken(user);

    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ErrorHandler("Invalid Email or Password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ErrorHandler("Invalid Email or Password", 400);
    }

    const accessToken = this.generateAccessToken(user);

    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: any) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "15m",
      },
    );
  }

  private generateRefreshToken(user: any) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    }

    return jwt.sign(
      {
        userId: user._id,
      },
      refreshSecret,
      {
        expiresIn: "7d",
      },
    );
  }
}

export default new UserService();
