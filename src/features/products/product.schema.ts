import { UploadedImage } from "#shared/cloudinary/images.types";
import { ParamsSlugSchema, QueriesSchema } from "#shared/Schemas";
import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(1, "Products must have a title")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Products must have a description")
    .max(255, "Description is too long"),
  price: z.coerce.number().min(0, "Price can't be less than 0"),
  images: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string(),
      }),
    )
    .min(1, "Image is required"),
  size: z.enum(["Small", "Medium", "Large", "XL", "XXL"]).optional(),
  colors: z.string().optional(),
  stockCount: z.int().positive().default(0),
  status: z
    .enum(["available", "sold", "outOfStock", "hidden"])
    .default("available"),
});

export const CreateProductParamsSchema = z.object({
  slug: z.string(),
});

export const GetAllBusinessProductsSchema = z.object({
  params: ParamsSlugSchema,
  query: QueriesSchema,
});

export const GetProductByIdSchema = z.object({
  productId: z.string(),
});

export const DeleteProductSchema = GetProductByIdSchema

export const EditProductSchema = z.object({
  params: GetProductByIdSchema,
  body: CreateProductSchema,
  files: CreateProductSchema.pick({ images: true }).optional(),
});

export const LikeProductSchema = z.object({
    userId: z.string(),
    params: GetProductByIdSchema
})

export const GetUserLikedProducts = z.object({
  query: QueriesSchema,
  user: z.object({
    userId: z.string(),
    role: z.enum(["Admin", "User"])
  })
})

export type CreateProductInput = z.infer<typeof CreateProductSchema> &
  z.infer<typeof CreateProductParamsSchema>;
export type GetProductInput = z.infer<typeof GetAllBusinessProductsSchema>;
export type GetProductByIdInput = z.infer<typeof GetProductByIdSchema>;
export type EditProductInput = z.infer<typeof EditProductSchema>;
export type LikeProductInput = z.infer<typeof LikeProductSchema>;
export type DeleteProductInput = z.infer<typeof DeleteProductSchema>;
export type GetUserLikedProductsInput = z.infer<typeof GetUserLikedProducts>