import { RequestHandler } from "express";
import {
  createUserModel,
  loginModel,
  toggleSaveModel,
  toggleAdoptModel,
  toggleFosterModel,
  updateModel,
} from "../model/user";

export const createUser: RequestHandler = async (req, res) => {
  const user = await createUserModel(req.body);
  res.send(user);
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.query as { email: string; password: string };
  const user = await loginModel(email, password);
  res.send(user);
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

export const toggleSave: RequestHandler = async (req, res) => {
  const { userId, petId } = req.body as { userId: string; petId: string };
  const user = await toggleSaveModel(userId, petId);
  res.send(user);
};

export const toggleAdopt: RequestHandler = async (req, res) => {
  const { userId, petId } = req.body as { userId: string; petId: number };
  const user = await toggleAdoptModel(userId, petId);
  res.send(user);
};

export const toggleFoster: RequestHandler = async (req, res) => {
  const { userId, petId } = req.body as { userId: string; petId: number };
  const user = await toggleFosterModel(userId, petId);
  res.send(user);
};
