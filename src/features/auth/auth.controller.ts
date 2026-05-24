import { catchAsync } from "#shared/catchAsync";
import { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schemas";
import { registerUser } from "./auth.service";
import { setRefreshCookie } from "./auth.cookie";





const register = catchAsync(async (req: Request, res:Response) => {
    const input = RegisterSchema.parse(req.body)

    const user = await registerUser(input)

    res.status(201).json({
        success: true,
        data: {user},
        message: "Account created successfully",
    })
})

const login = catchAsync(async (req: Request, res: Response) => {
    const input = LoginSchema.parse(req.body)

    const {accessToken, refreshToken, user} = await loginUser(input)

    setRefreshCookie(res, refreshToken)

    res.status(200).json({
        success: true,
        data: {
            accessToken,
            user,
        },
        message: "Login successfully"
    })
})

export {register,}