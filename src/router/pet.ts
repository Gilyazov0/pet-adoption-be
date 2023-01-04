import { Router } from "express";
import { search, addPet, getPetById } from "../controller/pet";
import { isAdmin } from "../middleware/userMiddleware";
import upload from "../middleware/imagesMiddleware";

const router = Router();

router.get("/id", getPetById);
router.get("/search", search);
router.post("/addPet", isAdmin, upload.single("picture"), addPet);

export default router;
