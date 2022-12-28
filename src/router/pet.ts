import { Router } from "express";
import { getPetByIds, search, addPet } from "../controller/pet";
import validateBody from "../middleware/validateBody";
import petSchema from "../Schemas/petSchema";

const router = Router();

router.get("/ids", getPetByIds);
router.get("/search", search);
router.post("/", addPet);

export default router;
