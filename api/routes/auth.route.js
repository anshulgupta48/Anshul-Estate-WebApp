import express from 'express';
import { signUp, signIn, signOut, googleAuth } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/sign-out', signOut);
router.post('/google-auth', googleAuth);

export default router;