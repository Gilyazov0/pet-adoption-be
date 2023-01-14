"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pet_1 = __importDefault(require("../controller/pet"));
const userMiddleware_1 = require("../middleware/userMiddleware");
const imagesMiddleware_1 = __importDefault(require("../middleware/imagesMiddleware"));
const router = (0, express_1.Router)();
router.get("/id", pet_1.default.getPetById);
router.get("/search", pet_1.default.search);
router.post("/addPet", userMiddleware_1.isAdmin, imagesMiddleware_1.default.single("picture"), userMiddleware_1.isAdmin, pet_1.default.addPet);
router.post("/updatePet", userMiddleware_1.isAdmin, imagesMiddleware_1.default.single("picture"), userMiddleware_1.isAdmin, pet_1.default.updatePet);
exports.default = router;
//# sourceMappingURL=pet.js.map