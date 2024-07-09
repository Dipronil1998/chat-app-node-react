import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import generateTokenAndSetCookie  from '../utils/generateToken';
import { handleErrorMessage, handleSuccessMessage } from "../utils/responseService";


interface SignupRequestBody {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: 'male' | 'female';
}

export const signup = async (req:Request<{},{},SignupRequestBody>,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            handleErrorMessage(res, 400, "Passwords don't match")
            return;
        }

        const user = await User.findOne({ username });

        if (user) {
            handleErrorMessage(res, 400, "Username already exists");
            return;
        }

        const saltRounds = parseInt(process.env.SALT as string, 10);
        const salt:string = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id as string, res);
            await newUser.save();
            handleSuccessMessage(res, 201, 'Signup successfully.',{
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            handleErrorMessage(res, 400, "Invalid user data");
        }
    } catch (error:any) {
        next(error)
    }
}

export const login = async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            handleErrorMessage(res, 400, "Invalid username or password")
            return;
        }

        generateTokenAndSetCookie(user._id as string, res);
        handleSuccessMessage(res, 200, 'Login successfully.',{
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error:any) {
        next(error)
    }
}

export const logout = async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        handleSuccessMessage(res, 200, "Logged out successfully",{})
    } catch (error:any) {
        next(error)
    }
}