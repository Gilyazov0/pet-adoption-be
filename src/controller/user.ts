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
import { User, AdoptStatus } from "@prisma/client";
import FullUserData from "../Types/FullUserData";
import { AddEventModel } from "../model/event";

export default class UserController {
  public static getAllUsers: RequestHandler = async (req, res) => {
    const users = await getAllUsersModel();
    for (const user of users) this.delPassword(user);

    res.send(users);
  };

  public static createUser: RequestHandler = async (req, res) => {
    const user = await createUserModel(req.body.data);

    AddEventModel({ authorId: user.id, type: "NewUser" });

    res.send(this.delPassword(user));
  };

  public static login: RequestHandler = async (req, res) => {
    const { password, user } = req.body.data as {
      password: string;
      user: User;
    };

    const result = await bcrypt.compare(password, user.password);
    if (!result)
      throw new AppError({
        description: "Authorization denied",
        httpCode: HttpCode.UNAUTHORIZED,
        isOperational: true,
      });

    const tokenData: TokenData = { id: user.id, isAdmin: user.isAdmin };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    AddEventModel({ authorId: user.id, type: "Login" });

    res.send({ user: this.delPassword(user), token });
  };

  public static update: RequestHandler = async (req, res) => {
    const user = await updateModel(req.body.data, req.body.tokenData.id);
    res.send(this.delPassword(user));
  };

  public static changeSave: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };
    const user = await changeSaveModel(req.body.tokenData.id, petId);
    res.send(this.delPassword(user));
  };

  public static changeAdopt: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };

    const user = await changeAdoptModel(req.body.tokenData.id, petId);

    const newStatus: AdoptStatus =
      user.pets.find((pet) => pet.id === petId)?.adoptionStatus || "Available";

    AddEventModel({
      authorId: req.body.tokenData.id,
      type: "NewPetStatus",
      petId: petId,
      newStatus,
    });
    res.send(this.delPassword(user));
  };

  public static changeFoster: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };
    const user = await changeFosterModel(req.body.tokenData.id, petId);

    const newStatus: AdoptStatus =
      user.pets.find((pet) => pet.id === petId)?.adoptionStatus || "Available";
    console.log(user.pets, newStatus, petId);

    AddEventModel({
      authorId: req.body.tokenData.id,
      type: "NewPetStatus",
      petId: petId,
      newStatus,
    });

    res.send(this.delPassword(user));
  };

  public static delPassword(data: Partial<User | FullUserData>) {
    delete data.password;
    return data;
  }
}
