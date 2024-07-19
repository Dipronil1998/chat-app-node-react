import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", protectRoute,logout);

export default router;