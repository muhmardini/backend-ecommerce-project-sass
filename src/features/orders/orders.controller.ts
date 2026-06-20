import { catchAsync } from "#shared/catchAsync";
import {Request, Response} from 'express'
import { CreateOrderSchema, EditOrderSchema, GetBusinessOrdersSchema, GetOrderByIdSchema, GetUserOrdersSchema } from "./orders.schema";
import { orderService } from "./orders.service";
import { AppResponse, PaginatedResponse } from "#shared/types";


const createOrder = catchAsync(async (req: Request, res: Response) => {
    const input = CreateOrderSchema.parse({
        userId: req.user!.id!,
        body: req.body
    })
    const order = await orderService.createOrder(input)
    const response: AppResponse<typeof order> = {
        success: true,
        data: order,
        message: "Order has been created"
    }
    res.status(201).json(response)
})

const getOrder = catchAsync(async (req: Request, res: Response) => {
    const {orderId} = GetOrderByIdSchema.parse(req.params)
    const order = await orderService.getOrderById(orderId)
    const response: AppResponse<typeof order> = {
        success: true,
        data: order
    }
    res.status(200).json(response)
})

const getUserOrders = catchAsync(async (req: Request, res: Response) => {
    const input = {
        ...GetUserOrdersSchema.parse(req.query),
        id: req.user!.id!
    }
    const {userOrders, totalOrders, totalPages} = await orderService.getUserOrders(input)
    const response: PaginatedResponse<typeof userOrders> = {
        success: true,
        data: userOrders,
        pagination: {
            page: input.query.page,
            limit: input.query.limit,
            total: totalOrders,
            totalPages,
            hasNextPage: input.query.page < totalPages,
            hasPrevPage: input.query.page > 1
        }
    }
    res.status(200).json(response)
})

const getBusinessOrders = catchAsync(async (req: Request, res: Response) => {
    const input = GetBusinessOrdersSchema.parse({
        query: req.query,
        params: req.params
    })
    const {businessOrders, totalOrders, totalPages} = await orderService.getBusinessOrders(input)
    const response : PaginatedResponse<typeof businessOrders> = {
        success: true,
        data: businessOrders,
        pagination: {
            page: input.query.page,
            limit: input.query.limit,
            total: totalOrders,
            totalPages,
            hasNextPage: input.query.page < totalPages,
            hasPrevPage: input.query.page > 1
        }
    }
    res.status(200).json(response)
})

const editOrders = catchAsync(async (req: Request, res: Response) => {
    const input = EditOrderSchema.parse({
        params: req.params,
        body: req.body
    })
    const userId = req.user!.id!
    const editedOrder = await orderService.editOrder(input, userId)
})

const handleOrder = catchAsync(async (req: Request, res: Response) => {
    
})

export {
    createOrder,
    getOrder,
    getUserOrders,
    getBusinessOrders,
    editOrders,
    handleOrder
}