import { Router } from "express";
import { auth, isAdmin } from "../middleware/userMiddleware";
import EventsController from "../controller/events";

const router = Router();

router.get("/newsfeed", isAdmin, EventsController.getNewsfeed);

export default router;
