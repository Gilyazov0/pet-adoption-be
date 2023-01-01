import { RequestHandler } from "express";
import { getUserByEmail } from "../model/user";
import { AppError, HttpCode } from "../exceptions/AppError";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../Types/TokenData";
import TokenData from "../Types/TokenData";

export const doesUserExist: RequestHandler = async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    throw new AppError({
      description: "Authorization denied",
      httpCode: HttpCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  req.body.user = user;
  next();
};

export const hashPassword: RequestHandler = async (req, res, next) => {
  const saltRounds = 10;
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);

  next();
};

export const auth: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AppError({
      description: "Authorization headers required",
      httpCode: HttpCode.BAD_REQUEST,
    });
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenData;
  req.body.tokenData = decoded;
  next();
};
