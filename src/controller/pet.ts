import { RequestHandler } from "express";
import SearchParams from "../Types/searchParams";
import { getPetByIdModel, searchModel, addPetModel } from "../model/pet";

export const getPetById: RequestHandler = async (req, res) => {
  const id = Number(req.query.id);

  const pet = await getPetByIdModel(id);
  res.send(pet);
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
