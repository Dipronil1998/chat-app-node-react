import { Request, Response, NextFunction } from "express";
import User from '../models/user.model';
import { handleSuccessMessage } from "../utils/responseService";
import logger from "../services/logger";

interface CustomRequest extends Request{
    user?: {
        _id: string;
    };
}

export const getUsersForSidebar = async (req:CustomRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const loggedInUserId = req.user?._id;

        if (!loggedInUserId) {
            logger.error('User not authenticated')
            res.status(400).json({ error: "User not authenticated" });
            return;
        }

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        logger.info('fetched sidebar user data')
        handleSuccessMessage(res, 200, '',filteredUsers)
    } catch (error:any) {
        next(error)
    }
}