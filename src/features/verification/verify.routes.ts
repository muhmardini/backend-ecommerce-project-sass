import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { myRequests, verificationRequest } from './verify.controller';

const route = express.Router();

route.post('/', authenticate, verificationRequest)

route.get('/me', authenticate, myRequests)

