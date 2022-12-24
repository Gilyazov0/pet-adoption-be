import { Router } from "express";
import {
  createUser,
  login,
  update,
  toggleSave,
  toggleAdopt,
  toggleFoster,
} from "../controller/user";

const router = Router();

router.route("/").post(createUser).get(login).patch(update);

router.post("/toggleSave", toggleSave);
router.post("/toggleAdopt", toggleAdopt);
router.post("/toggleFoster", toggleFoster);

export default router;
