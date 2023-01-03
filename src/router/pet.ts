import { Router } from "express";
import { search, addPet, getPetById } from "../controller/pet";
import { isAdmin } from "../middleware/userMiddleware";

const router = Router();

router.get("/id", getPetById);
router.get("/search", search);
router.post("/", isAdmin, addPet);

export default router;
