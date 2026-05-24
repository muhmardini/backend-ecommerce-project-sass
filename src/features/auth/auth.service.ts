import { env } from "#shared/env";
import { Errors } from "#shared/error";
import { AuthUser } from "#types/express.d";
import { createUser, findUser } from "./auth.repository";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { generateAccessToken, generateRefreshToken, TokenPayload } from "#lib/token";
import bcrypt from "bcrypt";

export const registerUser = async (input: RegisterInput): Promise<AuthUser> => {
  const existingUser = await findUser(input);

  if (existingUser) {
    throw Errors.Conflict("User already exist");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    env.BCRYPT_SALT_ROUNDS,
  );

  const user = await createUser(input, hashedPassword);

  return user as AuthUser;
};

export const loginUser = async (
  input: LoginInput,
): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> => {
  const user = await findUser(input);

  const isValidPassword = await bcrypt.compare(
    input?.password,
    user?.password ?? env.DUMMY_HASH,
  );

  if (!user || !isValidPassword) {
    throw Errors.Unauthorized("Invalid email or password");
  }

  const tokenPayload: TokenPayload = { id: +user.id, role: user.role };

  return {
    accessToken: generateAccessToken(tokenPayload),
    refreshToken: generateRefreshToken(tokenPayload),
    user: {id: user.id, role: user.role}
  };
};
