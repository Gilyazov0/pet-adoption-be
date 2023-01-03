import { Router } from "express";
import {
  createUser,
  login,
  update,
  changeSave,
  changeAdopt,
  changeFoster,
} from "../controller/user";
import validateBody from "../middleware/validateBody";
import userSchema from "../Schemas/userSchema";
import loginSchema from "../Schemas/loginSchema";
import {
  auth,
  doesUserExist,
  hashPassword,
} from "../middleware/userMiddleware";

const router = Router();

router.route("/").post(hashPassword, createUser).patch(update);

router.post("/login", validateBody(loginSchema), doesUserExist, login);
router.post("/changeSave", auth, changeSave);
router.post("/changeAdopt", auth, changeAdopt);
router.post("/changeFoster", auth, changeFoster);

export default router;

JSON.stringify;
