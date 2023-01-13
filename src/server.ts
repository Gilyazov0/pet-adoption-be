import "express-async-errors";
import express, { Request } from "express";
import "dotenv/config";
import cors from "cors";
import petRouter from "./router/pet";
import userRouter from "./router/user";
import eventRouter from "./router/event";
import chatRouter from "./router/chat";
import handleError from "./middleware/handleError";
import { RequestHandler } from "express";
import { AppError, HttpCode } from "./exceptions/AppError";
import cookieParser from "cookie-parser";
import { Server } from "http";
import WebsocketServer from "./websocket";
import { PrismaClient, Prisma } from "@prisma/client";

const port = process.env.PORT || 8080;
const app = express();

app.use(
  cors<Request>({ origin: ["http://localhost:5173"], credentials: true })
);
app.use(cookieParser());
app.use(express.json());

app.use("/pet/", petRouter);
app.use("/user/", userRouter);
app.use("/event/", eventRouter);
app.use("/chat/", chatRouter);

app.use("*", (_, __): RequestHandler => {
  throw new AppError({
    description: "page not found",
    httpCode: HttpCode.NOT_FOUND,
  });
});

app.use(handleError);

export const server: Server = app.listen(port, () => {
  console.log(`Server started. Listening to the post ${port}`);
});

export const wsServer = new WebsocketServer(server);
