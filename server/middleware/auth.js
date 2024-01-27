
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import ErrorHandler from '../middleware/error.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    // console.log(token)
    if (!token) {
      throw new ErrorHandler('Authentication failed', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.userId, email: decoded.email });

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};