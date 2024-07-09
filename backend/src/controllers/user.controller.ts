import { Request, Response, NextFunction } from "express";
import User from '../models/user.model';
import { handleSuccessMessage } from "../utils/responseService";

interface CustomRequest extends Request{
    user?: {
        _id: string;
    };
}

export const getUsersForSidebar = async (req:CustomRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const loggedInUserId = req.user?._id;

        if (!loggedInUserId) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        handleSuccessMessage(res, 200, '',filteredUsers)
    } catch (error:any) {
        next(error)
    }
}