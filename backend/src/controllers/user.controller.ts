import { Request, Response, NextFunction } from "express";
import User, { IUser } from '../models/user.model';
import Conversation from '../models/conversation.model';
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

// export const getUsersForSidebar = async (req:CustomRequest,res:Response,next:NextFunction):Promise<void> =>{
//     try {
//         let otherUsersId: string[] = []
//         const loggedInUserId = req.user?._id;

//         if (!loggedInUserId) {
//             logger.error('User not authenticated')
//             res.status(400).json({ error: "User not authenticated" });
//             return;
//         }

//         const conversations = await Conversation.find({
//             participants:{ $all: [loggedInUserId] }
//         }, {_id:0, participants:1 }).sort({updatedAt:-1})

//         conversations.map((conversation)=>{
//             conversation.participants.map((participantId)=>{
//                 if (participantId.toString() !== loggedInUserId.toString() && !otherUsersId.includes(participantId.toString())) {
//                     otherUsersId.push(participantId.toString());
//                 }
//             })
            
//         })
        
//         console.log(otherUsersId,"otherUsersId");
        
//         const users: any[] = await User.find({ _id: { $in: otherUsersId } }).select('-password');
        
//         const userMap = new Map(users.map(user => [user._id.toString(), user]));
//         const filteredUsers = otherUsersId.map(id => userMap.get(id)).filter(user => user !== undefined);
//         logger.info('fetched sidebar user data')
//         handleSuccessMessage(res, 200, '',filteredUsers)
//     } catch (error:any) {
//         next(error)
//     }
// }