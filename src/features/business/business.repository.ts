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
  getAllBusinesses = () => {
    return prisma.business.findMany({
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
  getBusinessesCount = async (
    id: string,
    input: BusinessInputs.GetBusinesses,
  ) => {
    return await prisma.business.count({
      where: {
        businessTeam: {
          some: {
            userId: id,
            ...(input.role && { role: input.role }),
          },
        },
      },
    });
  };
  editBusiness = (input: BusinessInputs.EditBusiness) => {
    return prisma.business.update({
      where: { name: input.name },
      data: input,
    });
  };
  deleteBusiness = (input: BusinessInputs.DeleteBusiness) => {
    prisma.business.delete({
      where: { slug: input.slug },
    });
  };
}

export const businessRepo = new BusinessRepository();
