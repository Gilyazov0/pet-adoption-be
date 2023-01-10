import { RequestHandler } from "express";
import ChatModel, { RawMsgData } from "../model/chatModel";
import { isAdmin } from "../middleware/userMiddleware";
import { AppError, HttpCode } from "../exceptions/AppError";

type ChatMsg = { msg: string; authorId: number; name: string; time: Date };

export default class ChatController {
  public static getAllChats: RequestHandler = async (req, res) => {
    const messages = await ChatModel.getAllMessages();
    const chats: { [key: number]: ChatMsg[] } = {};

    for (const msg of messages) {
      const chatMsg: ChatMsg = this.formatMessage(msg);

      if (chats[msg.chatId]) chats[msg.chatId].push(chatMsg);
      else chats[msg.chatId] = [chatMsg];
    }
    res.send(chats);
  };

  public static getChatById: RequestHandler = async (req, res) => {
    const data = req.body.data;
    if (!req.body.tokenData.isAdmin && data.chatId !== req.body.tokenData.id)
      throw new AppError({
        httpCode: HttpCode.UNAUTHORIZED,
        description: "Unauthorized request",
      });

    const result = await ChatModel.getChatById(data.chatId);
    const chat = result.map((msg) => this.formatMessage(msg));
    res.send(chat);
  };

  private static formatMessage(msg: RawMsgData): ChatMsg {
    return {
      msg: msg.message,
      authorId: msg.authorId,
      time: msg.time,
      name: `${msg.author.firstName} ${msg.author.lastName}`,
    };
  }
}
