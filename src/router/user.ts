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
import loginSchema from "../Schemas/loginSchema";
import updateUserSchema from "../Schemas/updateUserSchema";
import {
  auth,
  doesUserExist,
  hashPassword,
} from "../middleware/userMiddleware";

const router = Router();

router.route("/").post(hashPassword, createUser);
router.put("/update", validateBody(updateUserSchema), auth, update);

router.post("/login", validateBody(loginSchema), doesUserExist, login);
router.post("/changeSave", auth, changeSave);
router.post("/changeAdopt", auth, changeAdopt);
router.post("/changeFoster", auth, changeFoster);

export default router;

JSON.stringify;
