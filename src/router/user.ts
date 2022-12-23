import { Router } from "express";
import {
  createUser,
  login,
  toggleSave,
  toggleAdopt,
  toggleFoster,
} from "../controller/user";

const router = Router();

router.route("/").post(createUser).get(login);

router.post("/toggleSave", toggleSave);
router.post("/toggleAdopt", toggleAdopt);
router.post("/toggleFoster", toggleFoster);

export default router;
