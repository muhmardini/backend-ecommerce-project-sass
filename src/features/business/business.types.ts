import { Business, Prisma } from "#generated/prisma/client";

export type ReturnedBusiness = Prisma.BusinessGetPayload<{
    select: {
        name: true,
        description: true,
        links: true,
        location: true,
        slug: true,
        createdAt: true,
        updatedAt: true
    }
}>