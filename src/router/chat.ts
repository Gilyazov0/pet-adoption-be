import { Router } from "express";
import { isAdmin, auth } from "../middleware/userMiddleware";
import ChatController from "../controller/chat";
import validateBody from "../middleware/validateBody";
import chatId from "../Schemas/chatId";

const router = Router();

router.get("/all", isAdmin, ChatController.getAllChats);
router.post("/byId", auth, validateBody(chatId), ChatController.getChatById);
router.post("/del", validateBody(chatId), isAdmin, ChatController.delChat);

export default router;
