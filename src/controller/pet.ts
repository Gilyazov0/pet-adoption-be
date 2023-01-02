import { RequestHandler } from "express";
import { PetType, AdoptStatus } from "@prisma/client";
import SearchParams from "../Types/searchParams";
import {
  getPetByIdModel,
  getPetsByIdsModel,
  searchModel,
  addPetModel,
} from "../model/pet";
import {
  changeSaveModel,
  changeAdoptModel,
  changeFosterModel,
} from "../model/user";

export const getPetById: RequestHandler = async (req, res) => {
  const id = Number(req.query.id);

  const pet = await getPetByIdModel(id);
  res.send(pet);
};

export const getPetByIds: RequestHandler = async (req, res) => {
  const params = (req.query as { ids: string }).ids;

  const ids = JSON.parse(params).map((id: any) => Number(id));

  const pets = await getPetsByIdsModel(ids);
  res.send(pets);
};

export const addPet: RequestHandler = async (req, res) => {
  const pet = await addPetModel(req.body);
  if (pet) res.send(pet);
};

export const search: RequestHandler = async (req, res) => {
  const params: SearchParams = {
    ...req.query,
    weight: Number(req.query.weight),
    height: Number(req.query.height),
  };
  const pets = await searchModel(params);
  res.send(pets);
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
