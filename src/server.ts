import express, { Request } from "express";
import "dotenv/config";
import cors from "cors";
import petRouter from "./router/pet";
import userRouter from "./router/user";

const port = process.env.PORT || 8080;

const app = express();

app.use(cors<Request>());
app.use(express.json());
app.use("/pet/", petRouter);
app.use("/user/", userRouter);

app.listen(port, () => {
  console.log(`Server started. Listening to the post ${port}`);
});
