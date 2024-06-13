import express from 'express';
import { getUser, updateUser, deleteUser, showAllListings } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();
router.get('/:id', getUser);
router.post('/update/:id', verifyUser, updateUser);
router.delete('/delete/:id', verifyUser, deleteUser);
router.get('/show-all-listings/:id', verifyUser, showAllListings);

export default router;