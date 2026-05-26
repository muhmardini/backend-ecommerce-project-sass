import { authenticate } from '#features/auth/auth.middleware';
import express from 'express'
import { deleteProfile, editProfile, myProfile } from './users.controller';

const route = express.Router();

route.get('/me', authenticate, myProfile)

route.patch('/profile', authenticate, editProfile)

route.delete('/delete-profile', deleteProfile)