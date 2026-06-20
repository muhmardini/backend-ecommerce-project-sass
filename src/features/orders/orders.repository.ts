import { prisma } from "#lib/prisma";
import { AuthUser } from "#types/express.d";
import { number } from "zod";
import { OrderInputs } from "./orders.schema";
import { CreateOrderRepoInput, EditOrderRepoInput } from "./orders.types";


class OrderRepository {
    createOrder = async (data: CreateOrderRepoInput ) => {
        return await prisma.$transaction(async tx => {
            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    businessId: data.businessId,
                    totalCost: data.totalCost,
                    status: "Pending"
                }
            })
            await tx.orderItem.createMany({
                data: data.items.map((item) => ({
                    ...item,
                    orderId: order.id
                }))
            })
        })
    }
    getOrderById = async (orderId: string) => {
        return await prisma.order.findUnique({
            where: {id: orderId}
        })
    }
    getUserOrders = async (input: OrderInputs.GetUserOrders & Pick<AuthUser, "id">) => {
        const skip = (input.query.page - 1) * input.query.limit
        const [userOrders, totalOrders] = await prisma.$transaction([
             prisma.order.findMany({
                where: {
                    userId: input.id
                },
                skip,
                take: input.query.limit
            }),
            prisma.order.count({
                where: {
                    userId: input.id
                }
            })
        ])
        return {userOrders, totalOrders}
    }
    getBusinessOrders = async (input: OrderInputs.GetBusinessOrders) => {
        const skip = (input.query.page - 1) * input.query.limit
        const [businessOrders, totalOrders] = await prisma.$transaction([
            prisma.order.findMany({
                where: {
                    business: {
                        slug: input.params.slug
                    },
                    skip,
                    take: input.query.limit
                }
            }),
            prisma.order.count({
                where: {
                    business:{
                        slug: input.params.slug
                    }
                }
            })
        ])
        return {businessOrders, totalOrders}
    }
    updateOrder = async (input: EditOrderRepoInput) => {
        return prisma.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({
                where: {orderId: input.orderId}
            })
            await tx.orderItem.createMany({
                data: input.items.map((item) => ({
                    orderId: input.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
            return tx.order.update({
                where: {id: input.orderId},
                data: {
                    totalCost: input.totalCost,
                    status: "Pending"
                },
                include: {
                    items: true
                }
            })
        })
    }
}

export const orderRepo = new OrderRepository();