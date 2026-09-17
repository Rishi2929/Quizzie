import type { Request, Response, NextFunction } from "express";

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction): void => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
