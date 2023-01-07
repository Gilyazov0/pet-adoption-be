import { RequestHandler } from "express";
import { getNewsfeedModel } from "../model/event";
import UserController from "./user";

export default class EventsController {
  public static getNewsfeed: RequestHandler = async (req, res) => {
    let result = await getNewsfeedModel();

    for (let event of result) {
      UserController.delPassword(event.author);
    }

    res.send(result);
  };
}
