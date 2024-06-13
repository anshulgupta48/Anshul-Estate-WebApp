import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/errorHandler.js';

export const getListing = async (req, res, next) => {
    try {
        const validListing = await Listing.findById(req.params.id);
        if (!validListing) {
            return next(errorHandler(404, 'Listing Not Found'));
        }
        res.status(200).json(validListing);
    } catch (error) {
        next(error);
    }
}


export const createListing = async (req, res, next) => {
    try {
        const newListing = await Listing.create(req.body)
        res.status(201).json(newListing);
    } catch (error) {
        next(error);
    }
}


export const updateListing = async (req, res, next) => {
    const validListing = await Listing.findById(req.params.id);
    if (!validListing) {
        return next(errorHandler(404, 'Listing Not Found'));
    }
    if (req.user.id !== validListing.userRef) {
        return next(errorHandler(401, 'You Can Only Update Your Own Listing'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}


export const deleteListing = async (req, res, next) => {
    const validListing = await Listing.findById(req.params.id);
    if (!validListing) {
        return next(errorHandler(404, 'Listing Not Found'));
    }
    if (req.user.id !== validListing.userRef) {
        return next(errorHandler(401, 'You Can Only Delete Your Own Listing'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing Has been Deleted Successfully');
    } catch (error) {
        next(error);
    }
}


export const searchListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const userRef = req.query.userRef;

        const listings = await Listing.find({ name: { $regex: searchTerm, $options: 'i' }, offer, furnished, parking, type, ...(userRef && { userRef }) }).sort({ [sort]: order }).limit(limit).skip(startIndex);
        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};