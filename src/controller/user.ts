import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "../exceptions/AppError";
import "dotenv/config";
import TokenData from "../Types/TokenData";
import { User, AdoptStatus } from "@prisma/client";
import FullUserData from "../Types/FullUserData";
import { EventModel } from "../model/eventModel";
import { PetModel } from "../model/petModel";
import UserModel from "../model/userModel";

export default class UserController {
  public static getAllUsers: RequestHandler = async (req, res) => {
    const users = await UserModel.getAllUsers();
    for (const user of users) this.delPassword(user);

    res.send(users);
  };

  public static getUserById: RequestHandler = async (req, res) => {
    const id = Number(req.query.id);
    if (!id)
      throw new AppError({
        description: "Invalid params",
        httpCode: HttpCode.BAD_REQUEST,
      });

    const user = await UserModel.getUserById(id);
    if (user) res.send(this.delPassword(user));
    else {
      throw new AppError({
        description: "user not found",
        httpCode: HttpCode.NOT_FOUND,
      });
    }
  };

  public static createUser: RequestHandler = async (req, res) => {
    const user = await UserModel.createUser(req.body.data);

    EventModel.AddEvent({ authorId: user.id, type: "NewUser" });

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
      expiresIn: "7d",
    });
    console.log(token, tokenData);

    res.cookie("token", token, { maxAge: 86000000, httpOnly: true });

    const newPets = await PetModel.getNewPets(user.id);
    const newAvailablePets = await PetModel.getNewAvailablePets(user.id);

    EventModel.AddEvent({ authorId: user.id, type: "Login" });

    res.send({
      user: this.delPassword(user),
      newPets,
      newAvailablePets,
    });
  };

  public static update: RequestHandler = async (req, res) => {
    const data = req.body.data;
    if (req.body.tokenData.id !== data.userId && !req.body.tokenData.isAdmin)
      throw new AppError({
        description: "Authorized request",
        httpCode: HttpCode.UNAUTHORIZED,
      });
    const user = await UserModel.update(data.data, data.userId);
    res.send(this.delPassword(user));
  };

  public static changeSave: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };
    const user = await UserModel.changeSave(req.body.tokenData.id, petId);
    res.send(this.delPassword(user));
  };

  public static changeAdopt: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };

    const user = await UserModel.changeAdopt(req.body.tokenData.id, petId);

    const newStatus: AdoptStatus =
      user.pets.find((pet) => pet.id === petId)?.adoptionStatus || "Available";

    EventModel.AddEvent({
      authorId: req.body.tokenData.id,
      type: "NewPetStatus",
      petId: petId,
      newStatus,
    });
    res.send(this.delPassword(user));
  };

  public static changeFoster: RequestHandler = async (req, res) => {
    const { petId } = req.body.data as { petId: number };
    const user = await UserModel.changeFoster(req.body.tokenData.id, petId);

    const newStatus: AdoptStatus =
      user.pets.find((pet) => pet.id === petId)?.adoptionStatus || "Available";

    EventModel.AddEvent({
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
