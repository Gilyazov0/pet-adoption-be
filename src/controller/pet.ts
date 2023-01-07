import { RequestHandler, Request } from "express";
import SearchParams from "../Types/searchParams";
import {
  getPetByIdModel,
  searchModel,
  addPetModel,
  updatePetModel,
} from "../model/pet";
import { AddEventModel } from "../model/event";
import { Prisma } from "@prisma/client";

export default class PetController {
  public static getPetById: RequestHandler = async (req, res) => {
    const id = Number(req.query.id);

    const pet = await getPetByIdModel(id);
    res.send(pet);
  };

  public static addPet: RequestHandler = async (req, res) => {
    console.log("addPet", req.body.tokenData);
    req = this.dataPreparation(req);

    const pet = await addPetModel(req.body.data);
    AddEventModel({
      authorId: req.body.tokenData.id,
      type: "NewPet",
      newStatus: pet.adoptionStatus,
      petId: pet.id,
    });

    res.send(pet);
  };

  public static updatePet: RequestHandler = async (req, res) => {
    req = this.dataPreparation(req);

    if (!req.body.data.picture) delete req.body.data.picture;
    const id = Number(req.body.data.id);

    const prevPet = await getPetByIdModel(id);
    delete req.body.data.id;

    const pet = await updatePetModel(req.body.data, id);

    const event: Prisma.EventUncheckedCreateInput = {
      authorId: req.body.tokenData.id,
      type: "PetUpdate",
      petId: pet.id,
    };

    if (prevPet?.adoptionStatus !== pet.adoptionStatus)
      event.newStatus = pet.adoptionStatus;

    AddEventModel(event);

    res.send(pet);
  };

  public static search: RequestHandler = async (req, res) => {
    const params: SearchParams = {
      ...req.query,
      weight: Number(req.query.weight),
      height: Number(req.query.height),
    };
    const pets = await searchModel(params);
    res.send(pets);
  };

  private static dataPreparation(req: Request) {
    console.log("in dataPreparation", req.body.tokenData);

    const data = req.body.data;
    data.picture! = req.file ? req.file.path : data.picture;
    data.height! = Number(data.height);
    data.weight! = Number(data.weight);
    data.hypoallergenic! = Boolean(data.hypoallergenic);
    return req;
  }
}
