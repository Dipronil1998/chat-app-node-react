import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequestBody:
 *       type: object
 *       required:
 *         - fullName
 *         - username
 *         - password
 *         - confirmPassword
 *         - gender
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         confirmPassword:
 *           type: string
 *           description: The password confirmation
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: The gender of the user
 *       example:
 *         fullName: John Doe
 *         username: johndoe
 *         password: secret123
 *         confirmPassword: secret123
 *         gender: male
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication API
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequestBody'
 *     responses:
 *       201:
 *         description: Signup successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 profilePic:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;