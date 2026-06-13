import { catchAsync } from "#shared/catchAsync";
import { Errors } from "#shared/error";
import { Request, Response } from "express";
import { productServices } from "./product.service";
import { CreateProductParamsSchema, CreateProductSchema, GetAllBusinessProductsSchema } from "./product.schema";
import { AppResponse } from "#shared/types";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files  as Express.Multer.File[];
  if (!files) {
    throw Errors.BadRequest("Image is required");
  }
  const user = req.user!;
  const params = CreateProductParamsSchema.parse(req.params)
  const input = { ...CreateProductSchema.parse(req.body), ...user, ...params };
  const createdProduct = await productServices.newProduct(input, files);
  const response: AppResponse<typeof createdProduct> = {
    success: true,
    data: createdProduct,
    message: "Product Created Successfully"
  }
});

const getBusinessProducts = catchAsync(async (req: Request, res: Response) => {
  const slug = GetAllBusinessProductsSchema.parse(req.params)
})

export {createProduct}
