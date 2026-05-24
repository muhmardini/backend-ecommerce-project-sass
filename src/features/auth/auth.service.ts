import { env } from "#shared/env";
import { Errors } from "#shared/error";
import { AuthUser } from "#types/express.d";
import { createUser, findUser } from "./auth.repository";
import { RegisterInput } from "./auth.schemas";
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
