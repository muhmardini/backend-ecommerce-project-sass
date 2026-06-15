import { businessRepo } from "#features/business/business.repository";
import { imageService } from "#shared/cloudinary/image.service";
import { Errors } from "#shared/error";
import { QueryInput } from "#shared/Schemas";
import { AuthUser } from "#types/express.d";
import { productRepo } from "./product.repository";
import {
  CreateProductInput,
  DeleteProductInput,
  EditProductInput,
  GetProductByIdInput,
  GetProductInput,
  LikeProductInput,
} from "./product.schema";

class ProductServices {
  newProduct = async (
    input: CreateProductInput,
    files: Express.Multer.File[],
  ) => {
    if (!files) {
      throw Errors.BadRequest("Image is required");
    }
    const uploadedImages = await imageService.uploadMultiple(
      files,
      "ecommerce/products",
    );
    return await productRepo.createProduct(input, uploadedImages);
  };
  getProducts = async (input: GetProductInput) => {
    const business = await businessRepo.getBusinessBySlug(input.params.slug);
    if (!business) {
      throw Errors.NotFound("Business is no longer exist");
    }
    const { products, totalProducts } =
      await productRepo.getBusinessProducts(input);
    return { products, totalProducts };
  };
  getAllProducts = async (input: QueryInput) => {
    const { products, totalProducts } = await productRepo.getAllProducts(input);
    return { products, totalProducts };
  };
  getProductById = async (input: GetProductByIdInput) => {
    const product = await productRepo.getProductById(input);
    if (!product) {
      throw Errors.NotFound("Product is no longer exist");
    }
    return product;
  };
  editProduct = async (input: EditProductInput) => {
    const product = await productRepo.getProductById(input.params);
    if (!product) {
      throw Errors.NotFound("Product is no longer exist");
    }
    if (input.files?.images && input.files.images.length > 0 && product.images.length > 0) {
      await Promise.all(
        product.images.map((image) => {
          imageService.delete(image.publicId)
        })
      )
      const uploadedImages = await imageService.uploadMultiple(
        input.files.images as unknown as Express.Multer.File[],
        "ecommerce/product",
      );
      await Promise.all(
        product.images.map((image) => imageService.delete(image.publicId)),
      );
      input.body.images = uploadedImages
    }
    
    const editedProduct = await productRepo.editProduct(input);
    return editedProduct;
  };
  likeProduct = async (input: LikeProductInput) => {
    const product = await productRepo.getProductById(input.params)
    if(!product) {
      throw Errors.NotFound("Product is no longer exist")
    }
    await productRepo.likeProduct(input)
  }
  unlikeProduct = async (input: LikeProductInput) => {
    const product = await productRepo.getProductById(input.params);
    if(!product) {
      throw Errors.NotFound("Product is no longer exist");
    }
    await productRepo.unlikeProduct(input)
  }
  deleteProduct = async (input: DeleteProductInput) => {
    const product = productRepo.getProductById(input);
    if(!product) {
      throw Errors.NotFound("Product is no longer exist")
    }
    await productRepo.deleteProduct(input)
  }
}

export const productServices = new ProductServices();
