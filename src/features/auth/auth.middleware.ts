import { AppError, Errors } from "#shared/error";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./auth.service";
import { catchAsync } from "#shared/catchAsync";

const authMiddleware = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    let token;
    if (authorization && authorization?.startsWith("Bearer")) {
      token = authorization.slice(7);
    } else if (req.cookies?.jwt) {
      token = authorization;
    }
    if (!token) {
      throw Errors.Unauthorized("No token provided");
    }
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id.toString(),
      role: payload.role,
    };
    next();
  },
);
