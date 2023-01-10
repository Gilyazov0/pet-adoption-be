import { RequestHandler } from "express";
import ChatModel from "../model/chatModel";

type ChatMsg = { msg: string; authorId: number; name: string; time: Date };

export default class ChatController {
  public static getAllChats: RequestHandler = async (req, res) => {
    const messages = await ChatModel.getAllMessages();
    const chats: { [key: number]: ChatMsg[] } = {};

    for (const msg of messages) {
      const chatMsg: ChatMsg = {
        msg: msg.message,
        authorId: msg.authorId,
        time: msg.time,
        name: `${msg.author.firstName} ${msg.author.lastName}`,
      };

      if (chats[msg.chatId]) chats[msg.chatId].push(chatMsg);
      else chats[msg.chatId] = [chatMsg];
    }
    res.send(chats);
  };
}
