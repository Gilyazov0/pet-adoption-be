import { RequestHandler } from "express";
import { getUserByEmail } from "../model/user";

export const isUserExist: RequestHandler = async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (user) res.status(400).send("User exists");
  next();
};
