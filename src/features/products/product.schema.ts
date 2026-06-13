import {z} from 'zod'

export const CreateProductSchema = z.object({
    title: z.string().min(1, "Products must have a title").max(100, "Title is too long"),
    description: z.string().min(1, "Products must have a description").max(255, "Description is too long"),
    price: z.coerce.number().min(0, "Price can't be less than 0"),
    images: z.array(z.string()).min(1, "Image is required"),
    size: z.enum(["Small","Medium","Large","XL","XXL"]).optional(),
    colors: z.string().optional(),
    stockCount: z.int().positive().default(0),
    status: z.enum(["available", "sold", "outOfStock", "hidden"]).default("available"),
})

export const CreateProductParamsSchema = z.object({
    slug: z.string()
})

export const GetAllBusinessProductsSchema = CreateProductParamsSchema

export type CreateProductInput = z.infer<typeof CreateProductSchema> & z.infer<typeof CreateProductParamsSchema>