import { authenticate } from '#features/auth/auth.middleware';
import { isOwner } from '#features/business/isOwner.middleware';
import express from 'express'
import { createProduct, deleteProduct, editProduct, getAllProducts, getBusinessProducts, getProduct, likedProducts, likeProduct, unLikeProduct } from './product.controller';


const router = express.Router();

// route.post('/', authenticate, isVerified, isOwner, upload.array("images", 4), )

router.get("/user/liked", authenticate, likedProducts)

router.get('/', getAllProducts);

router.get('/:id', getProduct);

router.patch('/:id', authenticate, isOwner, editProduct);

router.post('/:id/like', authenticate, likeProduct);

router.delete('/:id/like', authenticate, unLikeProduct)

router.delete('/:id', authenticate, isOwner, deleteProduct);

router.post("/business/:slug/products", authenticate, isOwner, createProduct);

router.get("/business/:slug/products", authenticate, getBusinessProducts);

