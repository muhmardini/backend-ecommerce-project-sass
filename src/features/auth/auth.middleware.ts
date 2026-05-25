import { Errors } from "#shared/error";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "#lib/token";
import { catchAsync } from "#shared/catchAsync";
import { AuthUser } from "#types/express.d";

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    let token;
    if (authorization && authorization?.startsWith("Bearer")) {
      token = authorization.slice(7);
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

export const authorize = (
  ...roles: AuthUser["role"][]
): ReturnType<typeof catchAsync> => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw Errors.Unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw Errors.Forbidden(
        `This action requires one of: ${roles.join(", ")}`,
      );
    }
    next();
  });
};
