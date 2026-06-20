import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { createOrder, editOrders, getBusinessOrders, getOrder, getUserOrders, handleOrder } from './orders.controller';
import { isOwner } from '#features/business/isOwner.middleware';

const router = express.Router();

// when using "/:id" I refer to the order ID, user or anything else will use "/:userId", "/:thingId"

router.post('/business/:slug', createOrder)

router.get('/:id', getOrder)

router.get('/user', getUserOrders)

router.get('/business/:slug', getBusinessOrders)

router.patch('/:id', editOrders)

router.patch('/:id/business/:slug', isOwner, handleOrder)

export default router

// the Authentication middleware will be putted in the parent route cause all routes require authentication
// review this and the create order logic from the start to end
