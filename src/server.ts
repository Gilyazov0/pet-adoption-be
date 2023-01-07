import "./process";
import "express-async-errors";
import express, { Request } from "express";
import "dotenv/config";
import cors from "cors";
import petRouter from "./router/pet";
import userRouter from "./router/user";
import eventRouter from "./router/event";
import handleError from "./middleware/handleError";
import { RequestHandler } from "express";
import { AppError, HttpCode } from "./exceptions/AppError";

const port = process.env.PORT || 8080;

const app = express();

app.use(cors<Request>());
app.use(express.json());

app.use("/pet/", petRouter);
app.use("/user/", userRouter);
app.use("/event/", eventRouter);

app.use("*", (_, __): RequestHandler => {
  throw new AppError({
    description: "page not found",
    httpCode: HttpCode.NOT_FOUND,
  });
});

app.use(handleError);

app.listen(port, () => {
  console.log(`Server started. Listening to the post ${port}`);
});
