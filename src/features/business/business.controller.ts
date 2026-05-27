import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import { EditBusinessSchema, NewBusinessSchema } from "./business.schema";
import { businessService } from "./business.service";
import { Errors } from "#shared/error";
import { AppResponse } from "#shared/types";

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

const getBusiness = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw Errors.Unauthorized("Not Authorized");
  }
  const businesses = businessService.getBusinesses(req.user.id);
  const response: AppResponse<typeof businesses> = {
    success: true,
    data: businesses
  }
  res.status(200).json(response)
});

const editBusiness = catchAsync(async (req: Request, res: Response) => {
  const input = EditBusinessSchema.parse(req.body)
  const editedBusiness = businessService.editingBusiness(input)
  const response: AppResponse<typeof editedBusiness> = {
    success: true,
    data: editedBusiness
  }
  res.status(200).json(response)
})

export { createBusiness, getBusiness, editBusiness };