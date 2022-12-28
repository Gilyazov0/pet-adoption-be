import { RequestHandler } from "express";
import { getPetByIdModel, getPetsByIdsModel, searchModel } from "../model/pet";

export const getPetById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const pet = await getPetByIdModel(id);
  res.send(pet);
};

export const getPetByIds: RequestHandler = async (req, res) => {
  const ids = (req.query as { ids: string[] }).ids;
  const pets = await getPetsByIdsModel(ids);
  res.send(pets);
};

export const addPet: RequestHandler = async (req, res) => {};

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
