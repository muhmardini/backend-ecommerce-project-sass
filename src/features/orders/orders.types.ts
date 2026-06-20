import { OrderInputs } from "./orders.schema"

export type OrderItemsData = {
    productId: string
    quantity: number
    price: number
}

export type CreateOrderRepoInput = {
    userId: string
    businessId: string
    totalCost: number
    items: OrderItemsData[]
}

export type EditOrderRepoInput = {
    orderId: string,
    totalCost : number,
    items: OrderItemsData[]
}