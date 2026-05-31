import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { createBusiness, editBusiness, getBusiness, getAllBusiness, deleteBusiness, myBusinesses } from './business.controller';

const router = express.Router();


// Core Endpoints
router.post('/', authenticate, createBusiness);

router.get('/:slug', getBusiness);

router.get('/', getAllBusiness)

router.get('/my-businesses', authenticate, myBusinesses)

router.patch('/', authenticate, editBusiness);

router.delete('/:slug', authenticate, deleteBusiness);

// manage members endpoints
router.post('/business')

export default router