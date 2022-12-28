"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const pet_1 = __importDefault(require("./router/pet"));
const user_1 = __importDefault(require("./router/user"));
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
throw new Error("this is an error");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/pet/", pet_1.default);
app.use("/user/", user_1.default);
app.listen(port, () => {
    console.log(`Server started. Listening to the post ${port}`);
});
//# sourceMappingURL=server.js.map