import { RequestHandler } from "express";
import {
  getPetByIdModel,
  getPetsByIdsModel,
  searchModel,
  addPetModel,
} from "../model/pet";

export const getPetById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
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
  const { name, type, weight, height, status } = req.query as {
    name?: string;
    type?: string;
    weight?: string;
    height?: string;
    status?: string;
  };
  const pets = await searchModel(name, type, weight, height, status);
  res.send(pets);
};
