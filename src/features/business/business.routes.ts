import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { createBusiness, editBusiness, getBusiness, getAllBusiness, deleteBusiness, myBusinesses } from './business.controller';

const router = express.Router();


// Core Endpoints
router.post('/business', authenticate, createBusiness);

router.get('/business/:slug', getBusiness);

router.get('/business', getAllBusiness)

router.get('/my-businesses', authenticate, myBusinesses)

router.patch('/business', authenticate, editBusiness);

router.delete('/business/:slug', authenticate, deleteBusiness);

// manage members endpoints
router.post('/business')

export default router