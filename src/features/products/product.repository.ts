import { prisma } from "#lib/prisma";
import { UploadedImage } from "#shared/cloudinary/images.types";
import { QueryInput } from "#shared/Schemas";
import { AuthUser } from "#types/express.d";
import { CreateProductInput, DeleteProductInput, EditProductInput, GetProductByIdInput, GetProductInput, GetUserLikedProductsInput, LikeProductInput } from "./product.schema";


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
    getBusinessProducts = async (input: GetProductInput) => {
        const skip = (input.query.page - 1) * input.query.limit
        const [products, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                where:{
                    business:{
                        slug: input.params.slug
                    }
                },
                skip,
                take: input.query.limit
            }),
            prisma.product.count({
                where:{
                    business:{
                        slug: input.params.slug
                    }
                }
            })
        ])
        return {products, totalProducts}
    }
    getAllProducts = async (input: QueryInput) => {
        const skip = (input.page - 1) * input.limit
        const [products, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                skip,
                take: input.limit
            }),
            prisma.product.count()
        ])
        return {products, totalProducts}
    }
    getProductById = async (input: GetProductByIdInput) => {
        return await prisma.product.findUnique({
            where:{id: input.productId},
            select:{
                title: true,
                description: true,
                price: true,
                images: true,
                size: true,
                colors: true,
                stockCount: true,
                business: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    }
    editProduct = async (input: EditProductInput) => {
        const { images, ...productData } = input.body
        return await prisma.product.update({
            where: {id: input.params.productId},
            data: {
                ...productData,
                ...(images
                    ? {
                          images: {
                              deleteMany: {},
                              create: images.map((image) => ({ ...image })),
                          },
                      }
                    : {}),
            },
        })
    }
    likeProduct = async (input: LikeProductInput) => {
        await prisma.likeProduct.create({
            data: {
                userId: input.userId,
                productId: input.params.productId
            }
        })
    }
    unlikeProduct = async (input: LikeProductInput) => {
        await prisma.likeProduct.delete({
            where: {id: input.params.productId, userId: input.userId}
        })
    }
    getLikedProducts = async (input: GetUserLikedProductsInput) => {
        const skip = (input.query.page - 1) * input.query.limit
        const [likedProducts, totalLikedProducts] = await prisma.$transaction([
            prisma.likeProduct.findMany({
                where: {userId: input.user.userId},
                skip,
                take: input.query.limit
            }),
            prisma.likeProduct.count({
                where: {id: input.user.userId}
            })
        ])
        return {likedProducts, totalLikedProducts}
    }
    deleteProduct = async (input: DeleteProductInput) => {
        await prisma.product.delete({
            where: {id: input.productId}
        })
    }
    findProducts = async (Ids: string[]) => {
        return await prisma.product.findMany({
            where: {
                id: {
                    in: Ids
                }
            },
            select: {
                id: true,
                title: true,
                price: true,
                stockCount: true,
                businessId: true,
            }
        })
    }
}


export const productRepo = new ProductRepository();