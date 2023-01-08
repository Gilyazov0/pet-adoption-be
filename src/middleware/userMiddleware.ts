import { RequestHandler, Request } from "express";
import { getUserByEmail } from "../model/user";
import { AppError, HttpCode } from "../exceptions/AppError";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TokenData from "../Types/TokenData";

export const doesUserExist: RequestHandler = async (req, _, next) => {
  const user = await getUserByEmail(req.body.data.email);
  if (!user) {
    throw new AppError({
      description: "Authorization denied",
      httpCode: HttpCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  req.body.data.user = user;
  next();
};

export const hashPassword: RequestHandler = async (req, _, next) => {
  const saltRounds = 10;
  if (req.body.data?.data?.password)
    req.body.data.data.password = await bcrypt.hash(
      req.body.data.data.password,
      saltRounds
    );

  if (req.body.data?.password)
    req.body.data.password = await bcrypt.hash(
      req.body.data.password,
      saltRounds
    );

  next();
};

export const auth: RequestHandler = (req, _, next) => {
  const tokenData = getTokenData(req);
  if (!tokenData.id)
    throw new AppError({
      description: "Unauthorized",
      httpCode: HttpCode.UNAUTHORIZED,
    });

  next();
};

export const isAdmin: RequestHandler = (req, _, next) => {
  const tokenData = getTokenData(req);
  if (!tokenData.isAdmin)
    throw new AppError({
      description: "Unauthorized for not admin users",
      httpCode: HttpCode.UNAUTHORIZED,
    });

  next();
};

const getTokenData = (req: Request): TokenData => {
  const error = new AppError({
    description: "Bad token",
    httpCode: HttpCode.BAD_REQUEST,
  });

  if (!req.cookies?.token) error;

  const decoded = jwt.verify(
    req.cookies.token,
    process.env.TOKEN_SECRET!
  ) as TokenData;

  if (!decoded.id) throw error;

  req.body.tokenData = decoded;

  return decoded;
};
