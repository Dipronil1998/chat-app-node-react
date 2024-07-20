import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { signup } from '../src/controllers/auth.controller';
import User  from '../src/models/user.model';
import { handleErrorMessage, handleSuccessMessage } from '../src/utils/responseService';
import generateTokenAndSetCookie from '../src/utils/generateToken'
import logger from '../src/services/logger';

jest.mock('bcryptjs');
jest.mock('../src/models/user.model');
jest.mock('../src/utils/responseService');
jest.mock('../src/services/logger');

const app = express();
app.use(express.json());
app.post('/api/auth/signup', signup);

describe('POST /signup', () => {
    let reqBody;

    beforeEach(() => {
        reqBody = {
            fullName: 'John Doe',
            username: 'johndoe',
            password: 'password123',
            confirmPassword: 'password123',
            gender: 'male'
        };

        (bcrypt.genSalt).mockResolvedValue(10);
        (bcrypt.hash).mockResolvedValue('dipronil');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if passwords do not match', async () => {
        reqBody.confirmPassword = 'differentPassword';

        const response = await request(app).post('/api/auth/signup').send(reqBody);

        expect(logger.error).toHaveBeenCalledWith("Passwords don't match");
        expect(handleErrorMessage).toHaveBeenCalledWith(expect.anything(), 400, "Passwords don't match");
        expect(response.status).toBe(400);
    });

    // it('should return 400 if username already exists', async () => {
    //     (User.findOne as jest.Mock).mockResolvedValue({ username: 'johndoe' });

    //     const response = await request(app).post('/signup').send(reqBody);

    //     expect(logger.error).toHaveBeenCalledWith("Username already exists");
    //     expect(handleErrorMessage).toHaveBeenCalledWith(expect.anything(), 400, "Username already exists");
    //     expect(response.status).toBe(400);
    // });

    // it('should create a new user and return 201 if signup is successful', async () => {
    //     (User.findOne as jest.Mock).mockResolvedValue(null);
    //     (User.prototype.save as jest.Mock).mockResolvedValue({});
    //     const newUser = {
    //         _id: new mongoose.Types.ObjectId(),
    //         fullName: 'John Doe',
    //         username: 'johndoe',
    //         password: 'hashedPassword',
    //         gender: 'male',
    //         profilePic: `https://avatar.iran.liara.run/public/boy?username=johndoe`
    //     };

    //     (User as jest.Mock).mockImplementation(() => newUser);

    //     const response = await request(app).post('/signup').send(reqBody);

    //     expect(generateTokenAndSetCookie).toHaveBeenCalledWith(newUser._id, expect.anything());
    //     expect(newUser.save).toHaveBeenCalled();
    //     expect(logger.info).toHaveBeenCalledWith('Signup successfully.');
    //     expect(handleSuccessMessage).toHaveBeenCalledWith(expect.anything(), 201, 'Signup successfully.', {
    //         _id: newUser._id,
    //         fullName: newUser.fullName,
    //         username: newUser.username,
    //         profilePic: newUser.profilePic,
    //     });
    //     expect(response.status).toBe(201);
    // });

    // it('should return 400 if user data is invalid', async () => {
    //     (User.findOne as jest.Mock).mockResolvedValue(null);
    //     (User.prototype.save as jest.Mock).mockResolvedValue(null);

    //     const response = await request(app).post('/signup').send(reqBody);

    //     expect(logger.error).toHaveBeenCalledWith("Invalid user data");
    //     expect(handleErrorMessage).toHaveBeenCalledWith(expect.anything(), 400, "Invalid user data");
    //     expect(response.status).toBe(400);
    // });

    // it('should handle errors and pass them to next', async () => {
    //     const errorMessage = 'Database connection error';
    //     (User.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

    //     const response = await request(app).post('/signup').send(reqBody);

    //     expect(logger.error).toHaveBeenCalledWith(errorMessage);
    //     expect(response.status).toBe(500); // Assuming handleErrorMessage sets status to 500 for internal errors
    // });
});

