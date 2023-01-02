import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "../exceptions/AppError";
import "dotenv/config";
import {
  createUserModel,
  changeSaveModel,
  changeAdoptModel,
  changeFosterModel,
  updateModel,
} from "../model/user";
import TokenData from "../Types/TokenData";

export const createUser: RequestHandler = async (req, res) => {
  const user = await createUserModel(req.body);
  res.send(user);
};

export const login: RequestHandler = async (req, res) => {
  const { password, user } = req.body;

  const result = await bcrypt.compare(password, user.password);
  if (!result)
    throw new AppError({
      description: "Authorization denied",
      httpCode: HttpCode.BAD_REQUEST,
      isOperational: true,
    });
  const tokenData: TokenData = { id: user.id };
  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1h",
  });
  res.send({ user, token });
};

export interface UpdatePayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  password?: string;
}
export const update: RequestHandler = async (req, res) => {
  const data = req.body as UpdatePayload;
  const user = await updateModel(data);
  res.send(user);
};

export const changeSave: RequestHandler = async (req, res) => {
  const { userId, petId, isSaved } = req.body as {
    userId: number;
    petId: number;
    isSaved: boolean;
  };
  const user = await changeSaveModel(userId, petId);
  res.send(user);
};

export const changeAdopt: RequestHandler = async (req, res) => {
  const { userId, petId } = req.body as { userId: number; petId: number };
  const user = await changeAdoptModel(userId, petId);
  res.send(user);
};

export const changeFoster: RequestHandler = async (req, res) => {
  const { userId, petId } = req.body as { userId: number; petId: number };
  const user = await changeFosterModel(userId, petId);
  res.send(user);
};
