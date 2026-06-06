import { catchAsync } from "#shared/catchAsync";
import { Request, response, Response } from "express";
import {
  DeleteBusinessSchema,
  DeleteMemberSchema,
  EditBusinessSchema,
  EditMemberBodySchema,
  EditMemberParamsSchema,
  GetAllBusinessesSchema,
  GetBusinessSchema,
  GetMembersQuerySchema,
  GetMembersSchema,
  NewBusinessSchema,
  NewMemberBodySchema,
  NewMemberParamsSchema,
} from "./business.schema";
import { businessService } from "./business.service";
import { AppResponse, PaginatedResponse } from "#shared/types";
import {
  GetUserBusinessesSchema,
  GetPaginateBusinessSchema,
} from "#features/business/business.schema";
import { Business } from "#generated/prisma/client";
import { userInfo } from "node:os";
import { authRepo } from "#features/auth/auth.repository";
import { authServices } from "#features/auth/auth.service";
import { id } from "zod/locales";

const createBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = NewBusinessSchema.parse(req.body);
  const business = await businessService.newBusiness(input);
  const response: AppResponse<typeof business> = {
    success: true,
    data: business,
    message: "Business created successfully!",
  };
  res.status(201).json(response);
});

const getAllBusiness = catchAsync(async (req: Request, res: Response) => {
  const queries = GetAllBusinessesSchema.parse(req.query);
  const businesses = await businessService.getBusinesses(queries);
  const totalBusinessesCount =
    await businessService.getTotalBusinessCount(queries);
  const pages = Math.ceil(totalBusinessesCount / queries.limit);
  const response: PaginatedResponse<typeof businesses> = {
    success: true,
    data: businesses,
    pagination: {
      page: queries.page,
      limit: queries.limit,
      total: totalBusinessesCount,
      totalPages: pages,
      hasNextPage: queries.page < pages,
      hasPrevPage: queries.page > 1,
    },
  };
  res.status(200).json(response);
});

const myBusinesses = catchAsync(async (req: Request, res: Response) => {
  const input = GetUserBusinessesSchema.parse(req.params);
  const queries = GetPaginateBusinessSchema.parse(req.query);
  const user = req.user!;
  const businesses = await businessService.getMyBusinesses(
    user.id,
    input,
    queries,
  );
  const totalBusinessesCount =
    await businessService.getUserTotalBusinessesCount(input, user.id);
  const pages = Math.ceil(totalBusinessesCount / queries.limit);
  const response: PaginatedResponse<typeof businesses> = {
    success: true,
    data: businesses,
    pagination: {
      page: queries.page,
      limit: queries.limit,
      total: totalBusinessesCount,
      totalPages: pages,
      hasNextPage: queries.page < pages,
      hasPrevPage: queries.page > 1,
    },
  };
  res.status(200).json(response);
});

const getBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = GetBusinessSchema.parse(req.params);
  const business = await businessService.getBusiness(input.slug);
  const response: AppResponse<typeof business> = {
    success: true,
    data: business,
  };
  res.status(200).json(response);
});

const editBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = EditBusinessSchema.parse(req.body);
  const editedBusiness = await businessService.editingBusiness(input);
  const response: AppResponse<typeof editedBusiness> = {
    success: true,
    data: editedBusiness,
  };
  res.status(200).json(response);
});

const deleteBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = DeleteBusinessSchema.parse(req.params);
  await businessService.deleteBusiness(input);
  const response: AppResponse<void> = {
    success: true,
    message: "Business deleted successfully",
  };
  res.status(204).send(response);
});

// ----------------------------------------- Manage Members Controllers --------------------------------------------------------

const newMember = catchAsync(async (req: Request, res: Response) => {
  const Ids = NewMemberParamsSchema.parse(req.params);
  const role = NewMemberBodySchema.parse(req.body);
  const input = {
    ...Ids,
    ...role,
  };
  const addNewMember = await businessService.addNewMember(input);
  const response: AppResponse<typeof addNewMember> = {
    success: true,
    data: addNewMember,
  };
  res.status(201).json(response);
});

const editMember = catchAsync(async (req: Request, res: Response) => {
  const role = EditMemberBodySchema.parse(req.body);
  const Ids = EditMemberParamsSchema.parse(req.params);
  const input = {
    ...Ids,
    ...role,
  };
  const editedMember = await businessService.editMember(input);
  const response: AppResponse<typeof editedMember> = {
    success: true,
    data: editedMember,
  };
  res.status(201).json(response);
});

const getMembers = catchAsync(async (req: Request, res: Response) => {
  const input = GetMembersSchema.parse(req.params);
  const queries = GetMembersQuerySchema.parse(req.query);
  const members = await businessService.getMembers(input, queries);
  const membersCount = await businessService.getMembersCount(input);
  const pages = Math.ceil(membersCount / queries.limit);
  const response: PaginatedResponse<typeof members> = {
    success: true,
    data: members,
    pagination: {
      page: queries.page,
      limit: queries.limit,
      total: membersCount,
      totalPages: pages,
      hasNextPage: queries.page < pages,
      hasPrevPage: queries.page > 1,
    },
  };
  res.status(200).json(response)
});

const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const input = DeleteMemberSchema.parse(req.params)
  await businessService.deleteMember(input)
  const response: AppResponse<void> = {
    success: true,
    message: "Member deleted successfully"
  }
  res.status(200).send()
})

export {
  createBusiness,
  getAllBusiness,
  getBusiness,
  myBusinesses,
  editBusiness,
  deleteBusiness,
  newMember,
  editMember,
  getMembers,
  deleteMember
};
