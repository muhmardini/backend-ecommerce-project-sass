import { Response } from "express";
export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    path: "/auth/refresh"
  });
};
