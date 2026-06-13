import { prisma } from "#lib/prisma";
import { UploadedImage } from "#shared/cloudinary/images.types";
import { CreateProductInput } from "./product.schema";


class ProductRepository {
    createProduct = async (input: CreateProductInput, images: UploadedImage[]) => {
        const { images: _, ...productData } = input
        const businessSlug = input.slug
        return prisma.product.create({
            data: {
                ...productData,
                business: {
                    connect: { slug: businessSlug },
                },
                images: {
                    create: images.map((image) => ({ ...image })),
                },
            },
        })
    }
}


export const productRepo = new ProductRepository();