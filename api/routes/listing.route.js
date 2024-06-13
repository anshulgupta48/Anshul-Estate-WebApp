import express from 'express';
import { createListing, updateListing, deleteListing, searchListings, getListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/create', verifyUser, createListing);
router.post('/update/:id', verifyUser, updateListing);
router.delete('/delete/:id', verifyUser, deleteListing);
router.get('/search-listings', searchListings);
router.get('/:id', getListing);

export default router;