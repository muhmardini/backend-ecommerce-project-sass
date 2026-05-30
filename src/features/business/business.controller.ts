import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import { DeleteBusinessSchema, EditBusinessSchema, GetBusinessSchema, NewBusinessSchema } from "./business.schema";
import { businessService } from "./business.service";
import { Errors } from "#shared/error";
import { AppResponse, PaginatedResponse } from "#shared/types";
import { GetBusinessesSchema, GetPaginateBusinessSchema } from "#features/business/business.schema";
import { userServices } from "#features/users/user.service";
import { Business } from "#generated/prisma/client";

const createBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = NewBusinessSchema.parse(req.body);
  const business = await businessService.newBusiness(input);
  const response: AppResponse<typeof business> = {
    success: true,
    data: business,
    message: "Business created successfully!"
  }
  res.status(201).json(response)
});

const getAllBusiness = catchAsync(async (_req: Request, res: Response) => {
  const businesses = businessService.getBusinesses();
  const response: AppResponse<typeof businesses> = {
    success: true,
    data: businesses
  }
  res.status(200).json(response)
});

const myBusinesses = catchAsync(async (req: Request, res: Response) => {
  const input = GetBusinessesSchema.parse(req.params);
  const queries = GetPaginateBusinessSchema.parse(req.query);
  const user = req.user!;
  const businesses = await businessService.getMyBusinesses(user.id, input, queries);
  const totalBusinesses = await businessService.getTotalBusinesses(user.id, input);
  const pages = Math.ceil(totalBusinesses / queries.limit);
  const response: PaginatedResponse<Pick<Business, "name" | "description" | "location" | "links" | "createdAt">> = {
    success: true,
    data: businesses,
    pagination: {
      page: queries.page,
      limit: queries.limit,
      total: totalBusinesses,
      totalPages: pages,
      hasNextPage: queries.page < pages,
      hasPrevPage: queries.page > 1,
    },
  };
  res.status(200).json(response);
});

const getBusiness = catchAsync(async (req:Request, res:Response) => {
  const input = GetBusinessSchema.parse(req.params)
  const business = await businessService.getBusiness(input)
  const response: AppResponse<typeof business> = {
    success: true,
    data: business
  }
  res.status(200).json(response)
})

const editBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = EditBusinessSchema.parse(req.body)
  const editedBusiness = businessService.editingBusiness(input)
  const response: AppResponse<typeof editedBusiness> = {
    success: true,
    data: editedBusiness
  }
  res.status(201).json(response)
})

const deleteBusiness = catchAsync(async (req: Request, res:Response) => {
  const input = DeleteBusinessSchema.parse(req.params)
  await businessService.deleteBusiness(input);
  const response: AppResponse<void> = {
    success: true,
    message: "Business deleted successfully"
  }
  res.status(204).json(response)
})

export { createBusiness, getAllBusiness, getBusiness, myBusinesses, editBusiness, deleteBusiness };