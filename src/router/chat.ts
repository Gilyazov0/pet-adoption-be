import { Router } from "express";
import { isAdmin, auth } from "../middleware/userMiddleware";
import ChatController from "../controller/chat";
import validateBody from "../middleware/validateBody";
import getChatById from "../Schemas/getChatById";

const router = Router();

router.get("/all", isAdmin, ChatController.getAllChats);
router.post(
  "/byId",
  auth,
  validateBody(getChatById),
  ChatController.getChatById
);

export default router;
