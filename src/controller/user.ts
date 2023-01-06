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
  getAllUsersModel,
} from "../model/user";
import TokenData from "../Types/TokenData";
import { User } from "@prisma/client";
import FullUserData from "../Types/FullUserData";

export default class UserController {
  public static getAllUsers: RequestHandler = async (req, res) => {
    const users = await getAllUsersModel();
    for (const user of users) this.delPassword(user);

    res.send(users);
  };

  public static createUser: RequestHandler = async (req, res) => {
    const user = await createUserModel(req.body);

    res.send(this.delPassword(user));
  };

  public static login: RequestHandler = async (req, res) => {
    const { password, user } = req.body as { password: string; user: User };

    const result = await bcrypt.compare(password, user.password);
    if (!result)
      throw new AppError({
        description: "Authorization denied",
        httpCode: HttpCode.BAD_REQUEST,
        isOperational: true,
      });
    const tokenData: TokenData = { id: user.id, isAdmin: user.isAdmin };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    res.send({ user: this.delPassword(user), token });
  };

  public static update: RequestHandler = async (req, res) => {
    const user = await updateModel(req.body.data, req.body.userId);
    res.send(this.delPassword(user));
  };

  public static changeSave: RequestHandler = async (req, res) => {
    const { userId, petId, isSaved } = req.body as {
      userId: number;
      petId: number;
      isSaved: boolean;
    };
    const user = await changeSaveModel(userId, petId);
    res.send(this.delPassword(user));
  };

  public static changeAdopt: RequestHandler = async (req, res) => {
    const { userId, petId } = req.body as { userId: number; petId: number };
    const user = await changeAdoptModel(userId, petId);
    res.send(this.delPassword(user));
  };

  public static changeFoster: RequestHandler = async (req, res) => {
    const { userId, petId } = req.body as { userId: number; petId: number };
    const user = await changeFosterModel(userId, petId);
    res.send(this.delPassword(user));
  };

  private static delPassword(data: Partial<User | FullUserData>) {
    delete data.password;
    return data;
  }
}
