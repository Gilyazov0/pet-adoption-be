import { Router } from "express";
import {
  createUser,
  login,
  update,
  toggleSave,
  toggleAdopt,
  toggleFoster,
} from "../controller/user";
import validateBody from "../middleware/validateBody";
import userSchema from "../Schemas/userSchema";
import { doesUserExist, hashPassword } from "../middleware/userMiddleware";

const router = Router();

router.route("/").post(hashPassword, createUser).patch(update);

router.post("/login", doesUserExist, login);
router.post("/toggleSave", toggleSave);
router.post("/toggleAdopt", toggleAdopt);
router.post("/toggleFoster", toggleFoster);

export default router;

JSON.stringify;
