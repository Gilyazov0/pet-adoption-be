import { RequestHandler } from "express";
import { getNewPetsModel, getNewsfeedModel } from "../model/event";
import UserController from "./user";
import { getPetByIdModel } from "../model/pet";

export default class EventsController {
  public static getNewsfeed: RequestHandler = async (req, res) => {
    const { startDate, endDate } = req.query;
    let start: null | Date = null;
    let end: null | Date = null;

    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    }
    let result = await getNewsfeedModel(start, end);

    for (let event of result) {
      UserController.delPassword(event.author);
    }

    res.send(result);
  };

  public static getNewPets: RequestHandler = async (req, res) => {
    const id = req.body.tokenData.id;
    const events = await getNewPetsModel(id);

    const promises = [];
    for (const event of events) {
      promises.push(getPetByIdModel(event.petId!));
    }
    const pets = await Promise.all(promises);

    console.log("new pets", pets);

    res.send(pets);
  };
}
