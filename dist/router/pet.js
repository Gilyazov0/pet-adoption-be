"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pet_1 = require("../controller/pet");
const router = (0, express_1.Router)();
router.get("/ids", pet_1.getPetByIds);
router.get("/search", pet_1.search);
exports.default = router;
//# sourceMappingURL=pet.js.map