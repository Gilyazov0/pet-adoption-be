import { Router } from "express";
import { isAdmin } from "../middleware/userMiddleware";
import ChatController from "../controller/chat";

const router = Router();

router.get("/all", isAdmin, ChatController.getAllChats);

export default router;
