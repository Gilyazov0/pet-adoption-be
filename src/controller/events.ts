import { RequestHandler } from "express";
import EventModel from "../model/event";
import UserController from "./user";
import { getNewPetsModel, getPetByIdModel } from "../model/pet";

export default class EventsController {
  public static getNewsfeed: RequestHandler = async (req, res) => {
    const { startDate, endDate } = req.query;
    let start: null | Date = null;
    let end: null | Date = null;

    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    }
    let result = await EventModel.getNewsfeed(start, end);

    for (let event of result) {
      UserController.delPassword(event.author);
    }

    res.send(result);
  };
}
