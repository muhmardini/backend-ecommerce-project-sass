import { prisma } from "#lib/prisma";
import { AuthUser } from "#types/express.d";
import { RegisterInput, LoginInput } from "./auth.schemas";

type AuthInput = RegisterInput | LoginInput

export const findUser = (input: AuthInput) => {
    return prisma.user.findUnique({
        where: {email: input.email}
    })
}

export const findUserById = (id: string) => {
    return prisma.user.findUnique({
        where: {id: id},
        select: {
            id: true,
            role: true,
        }
    })
}

export const createUser = (input: RegisterInput,hashedPassword:string) => {
    return prisma.user.create({
        data: {
            email: input.email,
            name: input.name,
            password: hashedPassword,
        },
        select: {
            id: true,
            role: true
        }
    })
}