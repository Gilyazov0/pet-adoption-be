import { RequestHandler, Request } from "express";
import SearchParams from "../Types/searchParams";
import {
  getPetByIdModel,
  searchModel,
  addPetModel,
  updatePetModel,
} from "../model/pet";

export default class PetController {
  public static getPetById: RequestHandler = async (req, res) => {
    const id = Number(req.query.id);

    const pet = await getPetByIdModel(id);
    res.send(pet);
  };

  public static addPet: RequestHandler = async (req, res) => {
    req = this.dataPreparation(req);

    const pet = await addPetModel(req.body);
    res.send(pet);
  };

  public static updatePet: RequestHandler = async (req, res) => {
    req = this.dataPreparation(req);
    if (!req.body.picture) delete req.body.picture;
    const id = Number(req.body.id);
    delete req.body.id;

    const pet = await updatePetModel(req.body, id);

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
    req.body.picture! = req.file ? req.file.path : "";
    req.body.height! = Number(req.body.height);
    req.body.weight! = Number(req.body.weight);
    req.body.hypoallergenic! = Boolean(req.body.hypoallergenic);
    return req;
  }
}
