import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.get("/:userToChatId", protectRoute,getMessages);
router.post("/send/:receiverId", protectRoute,sendMessage);

export default router;