import { authRepo } from "#features/auth/auth.repository";
import { userRepo } from "#features/users/user.repository";
import { catchAsync } from "#shared/catchAsync";
import { Errors } from "#shared/error";
import { Request, Response, NextFunction } from "express";


export const verify = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const userPayload = req.user!
    const user = await authRepo.findUserById(userPayload.id)
    if(!user){
        throw Errors.NotFound("User no longer exist")
    }
    if(user.verified){
        next()
    }else{
        throw Errors.Forbidden("You must be verified")
    }
})