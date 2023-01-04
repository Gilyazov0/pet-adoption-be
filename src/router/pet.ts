import { Router } from "express";
import PetController from "../controller/pet";
import { isAdmin } from "../middleware/userMiddleware";
import upload from "../middleware/imagesMiddleware";

const router = Router();

router.get("/id", PetController.getPetById);
router.get("/search", PetController.search);
router.post("/addPet", isAdmin, upload.single("picture"), PetController.addPet);

export default router;
