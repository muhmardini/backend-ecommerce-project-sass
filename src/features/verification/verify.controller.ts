import { catchAsync } from "#shared/catchAsync";
import {Request, Response} from 'express'
import { GetUserRequestsSchema, VerificationRequestSchema } from "./verify.schema";
import { verifyService } from "./verify.service";
import { AppResponse, PaginatedResponse } from "#shared/types";
import { GetUserBusinessesSchema } from "#features/business/business.schema";

const verificationRequest = catchAsync(async (req: Request, res: Response) => {
    const verifyInputs = VerificationRequestSchema.parse(req.body)
    const input = {
        ...req.user!,
        ...verifyInputs
    }
    const verifyRequest = await verifyService.verifyRequest(input)
    const response: AppResponse<typeof verifyRequest> = {
        success: true,
        data: verifyRequest
    }
    res.status(201).json(response)
})

const myRequests = catchAsync(async (req: Request, res: Response) => {
    const query = GetUserRequestsSchema.parse(req.query)
    const user = req.user!
    const input = {
        ...user,
        ...query
    }
    const {requests, total} = await verifyService.myVerificationRequests(input)
    const pages = Math.ceil(total / input.limit)
    const response: PaginatedResponse<typeof requests> = {
        success: true,
        data: requests,
        pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: pages,
            hasNextPage: input.page < pages,
            hasPrevPage: pages > 1
        }
    }
    res.status(201).json(response)
})

export {verificationRequest, myRequests}