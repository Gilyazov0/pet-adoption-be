import { Router } from "express";
import PetController from "../controller/pet";
import { auth, isAdmin } from "../middleware/userMiddleware";
import upload from "../middleware/imagesMiddleware";

const router = Router();

router.get("/id", PetController.getPetById);
router.get("/search", PetController.search);
router.post(
  "/addPet",
  isAdmin,
  upload.single("picture"),
  isAdmin,
  PetController.addPet
);
router.post(
  "/updatePet",
  isAdmin,
  upload.single("picture"),
  isAdmin,
  PetController.updatePet
);

export default router;
