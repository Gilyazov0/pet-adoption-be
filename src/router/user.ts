import { Router } from "express";
import UserController from "../controller/user";
import validateBody from "../middleware/validateBody";
import loginSchema from "../Schemas/loginSchema";
import updateUserSchema from "../Schemas/updateUserSchema";
import {
  auth,
  doesUserExist,
  hashPassword,
} from "../middleware/userMiddleware";
import changePetStatusSchema from "../Schemas/changePetStatusSchema";
import { isAdmin } from "../middleware/userMiddleware";

const router = Router();

router
  .route("/")
  .post(hashPassword, UserController.createUser)
  .get(isAdmin, UserController.getUserById)
  .patch(
    validateBody(updateUserSchema),
    hashPassword,
    auth,
    UserController.update
  );

router.post(
  "/login",
  validateBody(loginSchema),
  doesUserExist,
  UserController.login
);

router.post(
  "/changeSave",
  validateBody(changePetStatusSchema),
  auth,
  UserController.changeSave
);

router.post(
  "/changeAdopt",
  validateBody(changePetStatusSchema),
  auth,
  UserController.changeAdopt
);

router.post(
  "/changeFoster",
  validateBody(changePetStatusSchema),
  auth,
  UserController.changeFoster
);

router.get("/allUsers", isAdmin, UserController.getAllUsers);

export default router;
