import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    username: string;
    password: string;
    gender: "male" | "female";
    profilePic?: string;
    lastSeen: Date
}

const userSchema: Schema<IUser> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
        },
        profilePic: {
            type: String,
            default: "",
        },
        lastSeen: {
            type: Date
        }
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
