import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import Conversation,{IConversation} from '../models/conversation.model'; // Adjust the path as needed
import Message,{ IMessage } from '../models/message.model'; // Adjust the path as needed
import logger from "../services/logger";
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";
import { getReceiverSocketId, io } from "../socket/socket";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        profilePic:string;
    };
}

interface PopulatedConversation extends Omit<IConversation, 'messages'> {
    messages: IMessage[];
}

export const getMessages = async (req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const { userToChatId } = req.params;
        const senderId = req.user?._id;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, new Types.ObjectId(userToChatId)] },
        }).populate('messages').lean<PopulatedConversation | null>();;

        if (!conversation) {
            logger.info('No message')
            handleSuccessMessage(res,200,'',[])
            return;
        }

        const messages = conversation.messages;

        handleSuccessMessage(res,200,'',messages)
    } catch (error:any) {
        logger.error(error.message)
        console.log(error);
        next(error)
    }
}

export const sendMessage = async (req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const { message,file }: { message: string, file:string } = req.body;
        const { receiverId } = req.params;
        const senderId = req.user?._id;
        const name = req.user?.fullName;
        const profilePic  = req?.user?.profilePic;

        if (!senderId) {
            logger.error('Unauthorized');
            handleErrorMessage(res, 401, 'Unauthorized');
            return;
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage:IMessage = new Message({
            senderId,
            receiverId,
            message,
            file
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id as Types.ObjectId);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", {name,receiverId, profilePic,newMessage});
		}

        logger.info('New message sent')
        handleSuccessMessage(res, 201, 'New message sent', newMessage)

    } catch (error:any) {
        logger.error(error.message)
        next(error)
    }
}
