import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
}

const messageSchema: Schema<IMessage> = new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
