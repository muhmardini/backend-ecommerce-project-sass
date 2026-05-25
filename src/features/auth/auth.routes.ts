import express from 'express'
import { login, logout, refresh, register } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router