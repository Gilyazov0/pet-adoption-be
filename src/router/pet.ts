import { Router } from "express";
import { getPetById, getPetByIds, search } from "../controller/pet";
const router = Router();

router.get("/ids", getPetByIds);
router.get("/search", search);

export default router;
