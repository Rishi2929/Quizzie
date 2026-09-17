import mongoose, { type Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const schema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model<IUser>("User", schema);
