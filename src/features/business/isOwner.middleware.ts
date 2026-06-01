import { catchAsync } from "#shared/catchAsync";
import { NextFunction, Request, Response } from "express";
import { businessRepo } from "./business.repository";
import { GetBusinessSchema, NewBusinessSchema } from "./business.schema";
import { Errors } from "#shared/error";


export const isOwner = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const user = req.user!
    const businessInfo = GetBusinessSchema.parse(req.params)
    const business = await businessRepo.findBusinessBySlug(businessInfo.slug)
    if(!business){
        throw Errors.NotFound("Business is no longer exist")
    }
    const businessMemberRole = await businessRepo.getBusinessMember(user.id, business.name)
    if(businessMemberRole?.role === "Owner"){
        next();
    }else {
        throw Errors.Unauthorized("You must Be an Owner for these set of actions")
    }
})