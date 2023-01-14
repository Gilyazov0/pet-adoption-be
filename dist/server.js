"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = exports.server = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const pet_1 = __importDefault(require("./router/pet"));
const user_1 = __importDefault(require("./router/user"));
const event_1 = __importDefault(require("./router/event"));
const chat_1 = __importDefault(require("./router/chat"));
const contactUs_1 = __importDefault(require("./router/contactUs"));
const handleError_1 = __importDefault(require("./middleware/handleError"));
const AppError_1 = require("./exceptions/AppError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const websocket_1 = __importDefault(require("./websocket"));
require("./process");
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ["http://localhost:5173"], credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/pet/", pet_1.default);
app.use("/user/", user_1.default);
app.use("/event/", event_1.default);
app.use("/chat/", chat_1.default);
app.use("/contactUs/", contactUs_1.default);
app.use("*", (req, _) => {
    throw new AppError_1.AppError({
        description: `page ${req.baseUrl} not found`,
        httpCode: AppError_1.HttpCode.NOT_FOUND,
    });
});
app.use(handleError_1.default);
exports.server = app.listen(port, () => {
    console.log(`Server started. Listening to the post ${port}`);
});
exports.wsServer = new websocket_1.default(exports.server);
//# sourceMappingURL=server.js.map