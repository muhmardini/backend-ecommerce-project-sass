import { prisma } from "#lib/prisma";
import { AuthUser } from "#types/express.d";
import { RegisterInput, LoginInput } from "./auth.schemas";

type AuthInput = RegisterInput | LoginInput;

export const findUser = (input: AuthInput) => {
  return prisma.user.findUnique({
    where: { email: input.email },
  });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      role: true,
    },
  });
};

export const createUser = (input: RegisterInput, hashedPassword: string):Promise<AuthUser> => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        role: true,
      },
    });
    await tx.profile.create({
        data: {
            fullname: input.name,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    return user
  });
};
