import { prisma } from "#lib/prisma";
import { BusinessInput } from "./business.schema";


class BusinessRepository {
    findBusiness = (name: string) => {
        return prisma.business.findUnique({
            where: {name: name}
        })
    }
    createBusiness = (input: BusinessInput) => {
        return prisma.business.create({
            data: {
                ...input,
                links: input.links ?? []
            }
        })
    }
    getAllBusinesses = (id:string) => {
        return prisma.business.findMany({
            where: {
                businessTeam: {
                    some:{
                        userId: id
                    }
                }
            },
        })
    }
}

export const businessRepo = new BusinessRepository();