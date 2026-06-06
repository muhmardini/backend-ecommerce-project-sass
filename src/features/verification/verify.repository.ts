import { prisma } from "#lib/prisma";
import { AuthUser } from "#types/express.d";
import { GetUserRequestsInput, VerificationRequestInput } from "./verify.schema";

class VerifyRepo {
    verifyRequests = (input: VerificationRequestInput & AuthUser) => {
        const {id, ...verificationInfo } = input
        return prisma.verificationInfo.create({
            data: {
                ...verificationInfo,
                status: "Pending",
                user: { connect: { id } },
            },
            select: {
                fullName: true,
                status: true,
                id: true,
                userId: true
            }
        })
    }
    getMyRequests = async (input: GetUserRequestsInput & AuthUser) => {
        const skip = (input.page - 1) * input.limit
        const [requests, total] = await prisma.$transaction([
            prisma.verificationInfo.findMany({
            where: {
                userId: input.id
            },
            skip,
            take: input.limit
        }),
            prisma.verificationInfo.count({
                where: {
                    userId: input.id
                }
            }),
        ])
        return {requests, total}
    }
}

export const verifyRepo = new VerifyRepo();