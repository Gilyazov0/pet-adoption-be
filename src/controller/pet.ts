import { RequestHandler, Request } from "express";
import SearchParams from "../Types/searchParams";
import { Prisma, AdoptStatus, Pet } from "@prisma/client";
import { AppError, HttpCode } from "../exceptions/AppError";
import EventModel from "../model/eventModel";
import { PetModel } from "../model/petModel";
import UserModel from "../model/userModel";

export default class PetController {
  public static getPetById: RequestHandler = async (req, res) => {
    const id = Number(req.query.id);

    if (!id)
      throw new AppError({
        description: "Invalid params",
        httpCode: HttpCode.BAD_REQUEST,
      });

    const pet = await PetModel.getPetById(id);
    if (pet) res.send(pet);
    else {
      throw new AppError({
        description: "user not found",
        httpCode: HttpCode.NOT_FOUND,
      });
    }
  };

  public static addPet: RequestHandler = async (req, res) => {
    req = this.dataPreparation(req);

    const pet = await PetModel.addPet(req.body.data);
    EventModel.AddEvent({
      authorId: req.body.tokenData.id,
      type: "NewPet",
      newStatus: pet.adoptionStatus,
      petId: pet.id,
    });

    res.send(pet);
  };

  public static updatePet: RequestHandler = async (req, res) => {
    req = this.dataPreparation(req);
    const data = req.body.data as Partial<Pet>;
    const id = Number(data.id);

    if (!data.picture) delete data.picture;
    delete data.id;

    const prevPet = await PetModel.getPetById(id);

    let newStatus: AdoptStatus | undefined = undefined;
    if (
      data.adoptionStatus === "Available" &&
      prevPet?.adoptionStatus !== "Available"
    ) {
      newStatus = "Available";
      if (prevPet?.adoptionStatus === "Adopted")
        UserModel.changeAdopt(prevPet.ownerId!, id);

      if (prevPet?.adoptionStatus === "Fostered")
        UserModel.changeFoster(prevPet.ownerId!, id);
    }
    delete data.adoptionStatus;

    const pet = await PetModel.updatePet(req.body.data, id);

    const event: Prisma.EventUncheckedCreateInput = {
      authorId: req.body.tokenData.id,
      type: "PetUpdate",
      petId: pet.id,
    };
    if (newStatus) event.newStatus;

    EventModel.AddEvent(event);

    res.send(pet);
  };

  public static search: RequestHandler = async (req, res) => {
    const data = req.query;
    const params: SearchParams = {
      ...data,
      maxWeight: Number(data.maxWeight)
        ? Number(data.maxWeight)
        : Number.MAX_VALUE,
      minWeight: Number(data.minWeight)
        ? Number(data.minWeight)
        : Number.MIN_VALUE,
      maxHeight: Number(data.maxHeight)
        ? Number(data.maxHeight)
        : Number.MAX_VALUE,
      minHeight: Number(data.minHeight)
        ? Number(data.minHeight)
        : Number.MIN_VALUE,
    };
    const pets = await PetModel.search(params);
    res.send(pets);
  };

  private static dataPreparation(req: Request) {
    const data = req.body.data;
    if (!data)
      throw new AppError({
        description: "Bad request body",
        httpCode: HttpCode.BAD_REQUEST,
      });
    data.picture = req.file ? req.file.path : data.picture;
    data.height = Number(data.height);
    data.weight = Number(data.weight);
    if (data.ownerId) data.ownerId! = Number(data.ownerId);
    data.hypoallergenic! = Boolean(data.hypoallergenic);
    return req;
  }
}
