import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { createBusiness, editBusiness, getBusiness } from './business.controller';

const router = express.Router();

router.post('/business', authenticate, createBusiness);

router.get('/business', authenticate, getBusiness);

router.patch('/business', authenticate, editBusiness);

export default router