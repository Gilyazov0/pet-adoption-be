"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controller/user"));
const validateBody_1 = __importDefault(require("../middleware/validateBody"));
const loginSchema_1 = __importDefault(require("../Schemas/loginSchema"));
const updateUserSchema_1 = __importDefault(require("../Schemas/updateUserSchema"));
const userMiddleware_1 = require("../middleware/userMiddleware");
const changePetStatusSchema_1 = __importDefault(require("../Schemas/changePetStatusSchema"));
const userMiddleware_2 = require("../middleware/userMiddleware");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(userMiddleware_1.hashPassword, user_1.default.createUser)
    .get(userMiddleware_2.isAdmin, user_1.default.getUserById)
    .patch((0, validateBody_1.default)(updateUserSchema_1.default), userMiddleware_1.hashPassword, userMiddleware_1.auth, user_1.default.update);
router.post("/login", (0, validateBody_1.default)(loginSchema_1.default), userMiddleware_1.doesUserExist, user_1.default.login);
router.post("/changeSave", (0, validateBody_1.default)(changePetStatusSchema_1.default), userMiddleware_1.auth, user_1.default.changeSave);
router.post("/changeAdopt", (0, validateBody_1.default)(changePetStatusSchema_1.default), userMiddleware_1.auth, user_1.default.changeAdopt);
router.post("/changeFoster", (0, validateBody_1.default)(changePetStatusSchema_1.default), userMiddleware_1.auth, user_1.default.changeFoster);
router.get("/allUsers", userMiddleware_2.isAdmin, user_1.default.getAllUsers);
exports.default = router;
//# sourceMappingURL=user.js.map