import { CreateProductSchema } from "#features/products/product.schema";
import {
  ParamsSlugSchema,
  ParamsUserIdSchema,
  QueriesSchema,
} from "#shared/Schemas";
import { Param } from "@prisma/client/runtime/client";
import { z } from "zod";

export const CreateOrderSchema = z.object({
  userId: z.string(),
  body: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })).min(1)
});

export const GetOrderByIdSchema = z.object({
  orderId: z.string(),
});

export const GetUserOrdersSchema = z.object({
  query: QueriesSchema,
});

export const GetBusinessOrdersSchema = z.object({
  query: QueriesSchema,
  params: ParamsSlugSchema,
});

export const EditOrderSchema = z.object({
  params: GetOrderByIdSchema,
  body: CreateOrderSchema.shape.body,
});

export const handleOrderSchema = z.object({
  params: z.object({
    id: z.string(),
    slug: ParamsSlugSchema,
  }),
  status: z.enum([
    "Pending",
    "Cancelled",
    "Rejected",
    "Confirmed",
    "Prepared",
    "Shipped",
    "Delivered",
  ]),
});

export namespace OrderInputs {
  export type CreateOrder = z.infer<typeof CreateOrderSchema>;
  export type GetOrder = z.infer<typeof GetOrderByIdSchema>;
  export type GetUserOrders = z.infer<typeof GetUserOrdersSchema>;
  export type GetBusinessOrders = z.infer<typeof GetBusinessOrdersSchema>;
  export type EditOrder = z.infer<typeof EditOrderSchema>;
}
