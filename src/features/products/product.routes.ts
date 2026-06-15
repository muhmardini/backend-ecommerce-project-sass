import { authenticate } from '#features/auth/auth.middleware';
import { isOwner } from '#features/business/isOwner.middleware';
import express from 'express'
import { deleteProduct, editProduct, getAllProducts, getProduct, likeProduct, unLikeProduct } from './product.controller';


const route = express.Router();

// route.post('/', authenticate, isVerified, isOwner, upload.array("images", 4), )

route.get('/', getAllProducts);

route.get('/:id', getProduct);

route.patch('/:id', authenticate, isOwner, editProduct);

route.post('/:id/like', authenticate, likeProduct);

route.delete('/:id/like', authenticate, unLikeProduct)

route.delete('/:id', authenticate, isOwner, deleteProduct);

