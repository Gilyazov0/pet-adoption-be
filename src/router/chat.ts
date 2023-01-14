import { Router } from "express";
import { isAdmin, auth } from "../middleware/userMiddleware";
import ChatController from "../controller/chat";
import validateBody from "../middleware/validateBody";
import chatIdSchema from "../Schemas/chatIdSchema";

const router = Router();

router.get("/all", isAdmin, ChatController.getAllChats);
router.post(
  "/byId",
  auth,
  validateBody(chatIdSchema),
  ChatController.getChatById
);
router.post(
  "/del",
  validateBody(chatIdSchema),
  isAdmin,
  ChatController.delChat
);

export default router;
