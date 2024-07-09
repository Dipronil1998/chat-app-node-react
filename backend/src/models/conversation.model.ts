import mongoose, { Document, Schema, Model } from "mongoose";

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: mongoose.Types.ObjectId[];
}

const conversationSchema: Schema<IConversation> = new Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
