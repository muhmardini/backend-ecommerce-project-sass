import { Business } from "#generated/prisma/client";
import { prisma } from "#lib/prisma";
import slugify from "slugify";
import { BusinessInputs, MemberInputs } from "./business.schema";
import { AuthUser } from "#types/express.d";

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
  createBusiness = async (input: BusinessInputs.CreateBusiness) => {
    return await prisma.business.create({
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
        createdAt: true,
      },
    });
  };
  getAllBusinesses = async (input: BusinessInputs.GetAllBusinessesInput) => {
    const skip = (input.query.page - 1) * input.query.limit;
    const [businesses, totalBusinesses] = await prisma.$transaction([
      prisma.business.findMany({
      skip,
      take: input.query.limit,
      select: {
        name: true,
        description: true,
      },
    }),
    prisma.business.count()
    ]) 
    return {businesses, totalBusinesses}
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
        id: true,
      },
    });
  };
  getBusinesses = async (
    input: BusinessInputs.GetAllBusinessesInput & AuthUser,
  ): Promise<{
    businesses: Pick<Business,"name" | "description" | "location" | "links" | "createdAt">[],
    totalBusinesses: number
  }> => {
    const skip = (input.query.page - 1) * input.query.limit;
    const [businesses, totalBusinesses] = await prisma.$transaction([
  prisma.business.findMany({
      where: {
        businessTeam: {
          some: {
            userId: input.id,
            ...(input.query.role && { role: input.query.role }),
          },
        },
      },
      skip,
      take: input.query.limit,
      select: {
        name: true,
        description: true,
        location: true,
        links: true,
        slug: true,
        createdAt: true,
        ...(input.query.role === "CoWorker" ? undefined : { updatedAt: true }),
      },
    }),
    prisma.business.count({
      where: {id: input.id}
    })
    ])
    return {businesses, totalBusinesses}
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
  };

  addBusinessMember = async (
    businessId: string,
    input: MemberInputs.NewMember,
  ) => {
    return await prisma.businessMember.create({
      data: {
        userId: input.params.userId,
        businessId: businessId,
        role: input.body.role,
      },
    });
  };

  editBusinessMember = async (
    businessId: string,
    input: MemberInputs.EditMember,
  ) => {
    return await prisma.businessMember.update({
      where: {
        userId_businessId: {
          userId: input.params.userId,
          businessId: businessId,
        },
      },
      data: {
        role: input.body.role,
      },
    });
  };

  getBusinessMembers = async (input: MemberInputs.GetMembers) => {
    const skip = (input.query.page - 1) * input.query.limit;
    return await prisma.businessMember.findMany({
      where: {
        business: {
          slug: input.params.slug,
        },
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: input.query.limit,
    });
  };
  getBusinessMembersCount = async (input: MemberInputs.GetMembers) => {
    return prisma.businessMember.count({
      where: {
        business: {
          slug: input.params.slug,
        },
      },
      // make it in an [] transaction with the getBusinessMembers above
    });
  };
}

export const businessRepo = new BusinessRepository();
