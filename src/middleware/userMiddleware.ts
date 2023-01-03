import { RequestHandler, Request } from "express";
import { getUserByEmail } from "../model/user";
import { AppError, HttpCode } from "../exceptions/AppError";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  if (req.body.password)
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

  next();
};

export const auth: RequestHandler = (req, res, next) => {
  const tokenData = getTokenData(req);
  if (!req.body.userId || req.body.userId !== tokenData.id)
    throw new AppError({
      description: "Unauthorized",
      httpCode: HttpCode.UNAUTHORIZED,
    });
  next();
};

const getTokenData = (req: Request): TokenData => {
  const error = new AppError({
    description: "Authorization headers error",
    httpCode: HttpCode.BAD_REQUEST,
  });
  if (!req.headers.authorization) throw error;

  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenData;
  if (!decoded.id) throw error;

  return decoded;
};
