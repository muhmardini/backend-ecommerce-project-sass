import { catchAsync } from "#shared/catchAsync";
import { Errors } from "#shared/error";
import { Request, Response } from "express";
import { error } from "node:console";
import { userServices } from "./user.service";
import { AppResponse } from "#shared/types";
import { EditProfileSchema } from "./user.schema.ts";

const myProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw Errors.NotFound("Authentication required");
  }
  const user = req.user;
  const profile = userServices.getProfile(user.id);
  const response: AppResponse<typeof profile> = {
    success: true,
    data: profile,
  };
  res.status(201).json(response);
});

const editProfile = catchAsync(async (req: Request, res: Response) => {
  const input = EditProfileSchema.parse(req.body);
  if (!req.user) {
    throw Errors.Unauthorized("Authentication required");
  }
  const editedProfile = userServices.changeProfile(input, req.user.id);
  const response: AppResponse<typeof editedProfile> = {
    success: true,
    data: editedProfile,
    message: "Profile has been edited",
  };
  res.status(200).json(response);
});

const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw Errors.Unauthorized("Authentication required");
  }
  userServices.deleteProfile(req.user.id)
  const response: AppResponse<void> = {
    success: true,
    message: "User & profile has been deleted"
  }
  res.status(204).json(response)
});

export { myProfile, editProfile, deleteProfile };
