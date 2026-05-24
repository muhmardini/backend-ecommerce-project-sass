import { prisma } from "#lib/prisma";
import { RegisterInput } from "./auth.schemas";


export const findUser = (input: RegisterInput) => {
    return prisma.user.findUnique({
        where: {email: input.email}
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