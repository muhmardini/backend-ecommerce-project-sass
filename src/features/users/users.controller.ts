import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { AppResponse, PaginatedResponse } from "#shared/types";
import { EditProfileSchema } from "./user.schema.ts";
import { productServices } from "#features/products/product.service";
import { GetUserLikedProducts } from "#features/products/product.schema";
import { LikeProduct } from "#generated/prisma/client";

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const profile = await userServices.getProfile(user.id);
  const response: AppResponse<typeof profile> = {
    success: true,
    data: profile,
  };
  res.status(200).json(response);
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  const input = EditProfileSchema.parse(req.body);
  const user = req.user!;

  const editedProfile = await userServices.changeProfile(input, user.id);
  const response: AppResponse<typeof editedProfile> = {
    success: true,
    data: editedProfile,
    message: "Profile has been edited",
  };
  res.status(200).json(response);
});

const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  await userServices.deleteProfile(user.id);
  const response: AppResponse<void> = {
    success: true,
    message: "User & profile has been deleted",
  };
  res.status(204).json(response);
});

const likedProducts = catchAsync(async (req: Request, res:Response) => {
  const input = GetUserLikedProducts.parse({
    query: req.query,
    user: req.user!
  })
  const {likedProducts, totalLikedProducts, totalPages} = await productServices.getLikedProducts(input)
  const response: PaginatedResponse<typeof likedProducts> = {
    success: true,
    data: likedProducts,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total: totalLikedProducts,
      totalPages,
      hasNextPage: input.query.page < totalPages,
      hasPrevPage: input.query.page > 1,
    }
  }
  res.status(200).json(response)
})

export { myProfile, editProfile, deleteProfile, likedProducts };
