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

const router = Router();

router
  .route("/")
  .post(/*validateBody(userSchema),*/ createUser)
  .get(login)
  .patch(update); // add validateBody dude

router.post("/toggleSave", toggleSave);
router.post("/toggleAdopt", toggleAdopt);
router.post("/toggleFoster", toggleFoster);
router.post("/test", (req, res) => {
  res.send("test response");
});

export default router;

JSON.stringify;
