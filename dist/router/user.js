"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controller/user");
const router = (0, express_1.Router)();
router.route("/").post(user_1.createUser).get(user_1.login).patch(user_1.update);
router.post("/toggleSave", user_1.toggleSave);
router.post("/toggleAdopt", user_1.toggleAdopt);
router.post("/toggleFoster", user_1.toggleFoster);
exports.default = router;
//# sourceMappingURL=user.js.map