import { RequestHandler } from "express";
import { getUserByEmail } from "../model/user";
import { AppError, HttpCode } from "../exceptions/AppError";

export const isUserExist: RequestHandler = async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (user)
    throw new AppError({
      description: "User with this email already exists",
      httpCode: HttpCode.BAD_REQUEST,
    });
  next();
};
