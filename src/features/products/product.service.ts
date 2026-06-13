import { imageService } from "#shared/cloudinary/image.service";
import { productRepo } from "./product.repository";
import { CreateProductInput } from "./product.schema";

class ProductServices {
    newProduct = async (input: CreateProductInput, files: Express.Multer.File[]) => {
        const uploadedImages = await imageService.uploadMultiple(files, "ecommerce/products")
        return await productRepo.createProduct(input, uploadedImages)
    }
}

export const productServices = new ProductServices();