import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import Conversation,{IConversation} from '../models/conversation.model'; // Adjust the path as needed
import Message,{ IMessage } from '../models/message.model'; // Adjust the path as needed
import logger from "../services/logger";
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
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
        const { message }: { message: string } = req.body;
        const { receiverId } = req.params;
        const senderId = req.user?._id;

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
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id as Types.ObjectId);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        logger.info('New message sent')
        handleSuccessMessage(res, 201, 'New message sent', newMessage)

    } catch (error:any) {
        logger.error(error.message)
        next(error)
    }
}
