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
import changePetStatusSchema from "../Schemas/changePetStatusSchema";

const router = Router();

router.route("/").post(hashPassword, createUser);

router.put(
  "/update",
  validateBody(updateUserSchema),
  hashPassword,
  auth,
  update
);

router.post("/login", validateBody(loginSchema), doesUserExist, login);

router.post(
  "/changeSave",
  validateBody(changePetStatusSchema),
  auth,
  changeSave
);

router.post(
  "/changeAdopt",
  validateBody(changePetStatusSchema),
  auth,
  changeAdopt
);

router.post(
  "/changeFoster",
  validateBody(changePetStatusSchema),
  auth,
  changeFoster
);

export default router;

JSON.stringify;
