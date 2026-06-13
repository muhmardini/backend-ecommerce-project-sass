import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import {
  DeleteBusinessSchema,
  DeleteMemberSchema,
  EditBusinessSchema,
  EditMemberSchema,
  GetAllBusinessesSchema,
  GetMembersSchema,
  NewBusinessSchema,
  NewMemberSchema,
} from "./business.schema";
import { businessService } from "./business.service";
import { AppResponse, PaginatedResponse } from "#shared/types";
import { ParamsSlugSchema } from "#shared/schemas/Schemas";

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
  const input = GetAllBusinessesSchema.parse(req.query);
  const { businesses, totalBusinesses } =
    await businessService.getBusinesses(input);
  const pages = Math.ceil(totalBusinesses / input.query.limit);
  const response: PaginatedResponse<typeof businesses> = {
    success: true,
    data: businesses,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total: totalBusinesses,
      totalPages: pages,
      hasNextPage: input.query.page < pages,
      hasPrevPage: input.query.page > 1,
    },
  };
  res.status(200).json(response);
});

const myBusinesses = catchAsync(async (req: Request, res: Response) => {
  const queries = GetAllBusinessesSchema.parse(req.query);
  const user = req.user!;
  const input = {
    ...queries,
    ...user,
  };
  const { businesses, totalBusinesses } =
    await businessService.getMyBusinesses(input);
  const pages = Math.ceil(totalBusinesses / input.query.limit);
  const response: PaginatedResponse<typeof businesses> = {
    success: true,
    data: businesses,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total: totalBusinesses,
      totalPages: pages,
      hasNextPage: input.query.page < pages,
      hasPrevPage: input.query.page > 1,
    },
  };
  res.status(200).json(response);
});

const getBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = ParamsSlugSchema.parse(req.params);
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
  const input = NewMemberSchema.parse({
    params: req.params,
    body: req.body,
  });
  const addNewMember = await businessService.addNewMember(input);
  const response: AppResponse<typeof addNewMember> = {
    success: true,
    data: addNewMember,
  };
  res.status(201).json(response);
});

const editMember = catchAsync(async (req: Request, res: Response) => {
  const input = EditMemberSchema.parse({
    params: req.params,
    body: req.body,
  });
  const editedMember = await businessService.editMember(input);
  const response: AppResponse<typeof editedMember> = {
    success: true,
    data: editedMember,
  };
  res.status(201).json(response);
});

const getMembers = catchAsync(async (req: Request, res: Response) => {
  const input = GetMembersSchema.parse({
    query: req.query,
    params: req.params,
  });
  const members = await businessService.getMembers(input);
  const membersCount = await businessService.getMembersCount(input);
  const pages = Math.ceil(membersCount / input.query.limit);
  const response: PaginatedResponse<typeof members> = {
    success: true,
    data: members,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total: membersCount,
      totalPages: pages,
      hasNextPage: input.query.page < pages,
      hasPrevPage: input.query.page > 1,
    },
  };
  res.status(200).json(response);
});

const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const input = DeleteMemberSchema.parse(req.params);
  await businessService.deleteMember(input);
  const response: AppResponse<void> = {
    success: true,
    message: "Member deleted successfully",
  };
  res.status(200).send(response);
});

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
  deleteMember,
};
