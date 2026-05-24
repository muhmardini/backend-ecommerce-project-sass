import { env } from "#shared/env";
import jwt, { SignOptions } from "jsonwebtoken";
import { Errors } from "#shared/error";

interface TokenPayload {
  id: number;
  role: "ADMIN" | "USER";
}

// generate token

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"], // 15min
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

// verify tokens

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    throw Errors.Unauthorized("Invalid or expired access Token");
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    throw Errors.Unauthorized("Invalid or expired refresh Token");
  }
};
