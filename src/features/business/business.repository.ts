import { Business } from "#generated/prisma/client";
import { prisma } from "#lib/prisma";
import slugify from "slugify";
import { BusinessInputs, MemberInputs } from "./business.schema";

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
        slug: slugify(input.name, {
          lower: true,
          strict: true,
        }),
        links: input.links ?? [],
      },
      select: {
        name: true,
        description: true,
        location: true,
        links: true,
        slug: true,
        createdAt: true
      }
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
      },
    });
  };
  getBusinessBySlug = (slug: string) => {
    return prisma.business.findUnique({
      where: { slug: slug },
      select: {
        name: true,
        description: true,
        location: true,
        links: true,
        slug: true,
        createdAt: true,
        id: true
      }
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
        slug: true,
        createdAt: true,
        ...(input.role === "CoWorker" ? undefined: {updatedAt: true})
      }
    });
  };
  getBusinessesCount = async (input: BusinessInputs.GetAllBusinessesInput) => {
    return await prisma.business.count();
  };
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
      where: { name: input.name },
    });
  };

  getBusinessMember = async (memberId: string, businessId: string) => {
    return await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: memberId,
          businessId: businessId,
        },
      },
      select: {
        role: true,
      },
    });
  }

  addBusinessMember = async (businessId: string, input: MemberInputs.NewMember) => {
    return await prisma.businessMember.create({
      data: {
        userId: input.userId,
        businessId: businessId,
        role: input.role
      }
    })
  }

  editBusinessMember = async (businessId: string, input: MemberInputs.EditMember) => {
    return await prisma.businessMember.update({
      where: {
        userId_businessId: {
          userId: input.userId,
          businessId: businessId
        }
      },
      data: {
        role: input.role
      }
    })
  }

  getBusinessMembers = async (input: MemberInputs.GetMembers, queries: MemberInputs.GetMembersQuery) => {
    const skip = (queries.page - 1) * queries.limit
    return await prisma.businessMember.findMany({
      where: {
        business: {
          slug: input.slug
        }
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip,
      take: queries.limit
    })
  }
  getBusinessMembersCount = async (input: MemberInputs.GetMembers) =>{
    return prisma.businessMember.count({
      where: {
        business: {
          slug: input.slug
        }
      }
    })
  }
}

export const businessRepo = new BusinessRepository();
