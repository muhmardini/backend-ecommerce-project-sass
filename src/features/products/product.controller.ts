import { catchAsync } from "#shared/catchAsync";
import { Errors } from "#shared/error";
import { Request, Response } from "express";
import { productServices } from "./product.service";
import {
  CreateProductParamsSchema,
  CreateProductSchema,
  DeleteProductSchema,
  EditProductSchema,
  GetAllBusinessProductsSchema,
  GetProductByIdSchema,
  LikeProductSchema,
} from "./product.schema";
import { AppResponse, PaginatedResponse } from "#shared/types";
import { ParamsUserIdSchema, QueriesSchema } from "#shared/Schemas";
import { file } from "zod";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const user = req.user!;
  const params = CreateProductParamsSchema.parse(req.params);
  const input = { ...CreateProductSchema.parse(req.body), ...user, ...params };
  const createdProduct = await productServices.newProduct(input, files);
  const response: AppResponse<typeof createdProduct> = {
    success: true,
    data: createdProduct,
    message: "Product Created Successfully",
  };
  res.status(201).json(response);
});

const getBusinessProducts = catchAsync(async (req: Request, res: Response) => {
  const input = GetAllBusinessProductsSchema.parse({
    params: req.params,
    query: req.query,
  });
  const { products, totalProducts } = await productServices.getProducts(input);
  const totalPages = Math.ceil(totalProducts / input.query.limit);
  const response: PaginatedResponse<typeof products> = {
    success: true,
    data: products,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total: totalProducts,
      totalPages,
      hasNextPage: input.query.page < totalPages,
      hasPrevPage: input.query.page > 1,
    },
  };
  res.status(200).json(response);
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const input = QueriesSchema.parse(req.query);
  const { products, totalProducts } =
    await productServices.getAllProducts(input);
  const totalPages = Math.ceil(totalProducts / input.limit);
  const response: PaginatedResponse<typeof products> = {
    success: true,
    data: products,
    pagination: {
      page: input.page,
      limit: input.limit,
      total: totalProducts,
      totalPages,
      hasNextPage: input.page < totalPages,
      hasPrevPage: input.page > 1,
    },
  };
  res.status(200).json(response);
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
  const input = GetProductByIdSchema.parse(req.params);
  const product = await productServices.getProductById(input);
  const response: AppResponse<typeof product> = {
    success: true,
    data: product,
  };
  res.status(201).json(response);
});

const editProduct = catchAsync(async (req: Request, res: Response) => {
  const input = EditProductSchema.parse({
    params: req.params,
    body: req.body,
    files: req.files as Express.Multer.File[],
  });
  const editedProduct = await productServices.editProduct(input);
  const response: AppResponse<typeof editedProduct> = {
    success: true,
    data: editedProduct,
  };
  res.status(204).json(response);
});

const likeProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!.id!;
  const input = LikeProductSchema.parse({
    userId: user,
    productId: req.params,
  });
  await productServices.likeProduct(input);
  const response: AppResponse<void> = {
    success: true,
    message: "Product added to liked products"
  }
  res.status(201).send(response)
});

const unLikeProduct = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!.id!;
  const input = LikeProductSchema.parse({
    userId: user,
    productId: req.params
  })
  await productServices.unlikeProduct(input);
  const response: AppResponse<void> = {
    success: true,
    message: "Product removed from liked products"
  }
  res.status(201).send(response)
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const input = DeleteProductSchema.parse(req.params);
  await productServices.deleteProduct(input)
  const response: AppResponse<void> = {
    success: true,
    message: "Product has been deleted"
  }
})

export {
  createProduct,
  getBusinessProducts,
  getAllProducts,
  getProduct,
  editProduct,
  likeProduct,
  unLikeProduct,
  deleteProduct
};
