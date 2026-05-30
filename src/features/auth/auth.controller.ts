import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schemas";
import { authServices } from "./auth.service";
import { setRefreshCookie } from "./auth.cookie";
import { error } from "node:console";
import { AppError, Errors } from "#shared/error";
import { AppResponse } from "#shared/types";
import { AuthUser } from "#types/express.d";
import { resolve } from "node:dns";

const register = catchAsync(async (req: Request, res: Response) => {
  const input = RegisterSchema.parse(req.body);

  const user = await authServices.registerUser(input);

  res.status(201).json({
    success: true,
    data: { user },
    message: "Account created successfully",
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const input = LoginSchema.parse(req.body);

  const { accessToken, refreshToken, user } = await authServices.loginUser(input);

  setRefreshCookie(res, refreshToken);
  const response: AppResponse<{accessToken: string, user: AuthUser}> = {
    success: true,
    data: {
      accessToken,
      user,
    },
    message: "Login successfully",
  }
  res.status(200).json(response);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (!refreshToken) {
    throw Errors.Unauthorized("No refresh token provided");
  }

  const { accessToken } = await authServices.refreshAccessToken(refreshToken);
  const response: AppResponse<{accessToken: string}> = {
    success: true,
    data: { accessToken },
  }
  res.status(200).json(response);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/auth/refresh",
  });
  res.status(204).send();
});

export { register, login };
