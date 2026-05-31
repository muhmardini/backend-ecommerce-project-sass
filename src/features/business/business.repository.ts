import { Business } from "#generated/prisma/client";
import { prisma } from "#lib/prisma";
import { BusinessInputs } from "./business.schema";

class BusinessRepository {
  findBusinessByName = (name: string) => {
    return prisma.business.findUnique({
      where: { name: name },
    });
  };
  findBusinessBySlug = (slug: string) => {
    return prisma.business.findUnique({
      where: { slug: slug },
    });
  };
  createBusiness = (input: BusinessInputs.CreateBusiness) => {
    return prisma.business.create({
      data: {
        ...input,
        links: input.links ?? [],
      },
    });
  };
  getAllBusinesses = (queries: BusinessInputs.GetAllBusinessesInput) => {
    const skip = (queries.page - 1) * queries.limit;
    return prisma.business.findMany({
      skip,
      take: queries.limit,
      select: {
        name: true,
        description: true,
        location: true,
        links: true,
      },
    });
  };
  getBusiness = (input: BusinessInputs.GetBusiness) => {
    return prisma.business.findUnique({
      where: { slug: input.slug },
    });
  };
  getBusinesses = async (
    id: string,
    input: BusinessInputs.GetBusinesses,
    queries: BusinessInputs.GetPaginateBusiness,
  ): Promise<
    Pick<
      Business,
      "name" | "description" | "location" | "links" | "createdAt"
    >[]
  > => {
    const skip = (queries.page - 1) * queries.limit;
    return await prisma.business.findMany({
      where: {
        businessTeam: {
          some: {
            userId: id,
            ...(input.role && { role: input.role }),
          },
        },
      },
      skip,
      take: queries.limit,
      select: {
        name: true,
        description: true,
        location: true,
        links: true,
        createdAt: true,
      },
    });
  };
  getBusinessesCount = async(input: BusinessInputs.GetAllBusinessesInput) => {
    return await prisma.business.count();
  }
  getUserBusinessesCount = async (
    input: BusinessInputs.GetBusinesses,
    id: string,
  ) => {
    return await prisma.business.count({
      where: {
        businessTeam: {
          some: {
            ...(id && { userId: id }),
            ...(input.role && { role: input.role }),
          },
        },
      },
    });
  };
  editBusiness = async (input: BusinessInputs.EditBusiness) => {
    return await prisma.business.update({
      where: { name: input.name },
      data: input,
    });
  };
  deleteBusiness = async (input: BusinessInputs.DeleteBusiness) => {
    await prisma.business.delete({
      where: { slug: input.slug },
    });
  };
}

export const businessRepo = new BusinessRepository();
