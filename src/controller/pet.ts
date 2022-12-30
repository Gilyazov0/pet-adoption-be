import { RequestHandler } from "express";
import { PetType, AdoptStatus } from "@prisma/client";
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
  const { name, type, weight, height, adoption_status } = req.query as {
    name?: string;
    type?: PetType;
    weight?: string;
    height?: string;
    adoption_status?: AdoptStatus;
  };
  const pets = await searchModel(
    name,
    type,
    Number(weight),
    Number(height),
    adoption_status
  );
  res.send(pets);
};
