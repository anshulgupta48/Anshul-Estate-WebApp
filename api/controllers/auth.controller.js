import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/errorHandler.js';

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;
    const oldUsername = await User.findOne({ username });
    if (oldUsername) {
        return next(errorHandler(406, 'Username Already Exist'));
    }
    const oldEmail = await User.findOne({ email });
    if (oldEmail) {
        return next(errorHandler(406, 'This Email is Already Linked with Another Account'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 14);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User Created Successfully');
    } catch (error) {
        next(error);
    }
}


export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
        return next(errorHandler(404, 'User Not Found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
        return next(errorHandler(401, 'Wrong Credentials'));
    }

    try {
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { expires: new Date(Date.now() + +process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000), httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User Has been Signed-Out Successfully');
    } catch (error) {
        next(error);
    }
}


export const googleAuth = async (req, res, next) => {
    try {
        const validUser = await User.findOne({ email: req.body.email });
        if (validUser) {
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = validUser._doc;
            res.cookie('access_token', token, { expires: new Date(Date.now() + +process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000), httpOnly: true }).status(200).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 14);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { expires: new Date(Date.now() + +process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000), httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}