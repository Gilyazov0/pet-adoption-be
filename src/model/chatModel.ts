import { Prisma } from "@prisma/client";
import PrismaModel from "./prismaModel";

export type RawMsgData = {
  message: string;
  time: Date;
  chatId: number;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
  };
};

export default class ChatModel extends PrismaModel {
  private static chat = this.client.chat;

  public static async delChat(chatId: number) {
    return await this.chat.deleteMany({ where: { chatId } });
  }
  public static async addMessage(msg: Prisma.ChatUncheckedCreateInput) {
    return await this.chat.create({ data: msg });
  }

  public static async getChatById(chatId: number): Promise<RawMsgData[]> {
    return await this.chat.findMany({
      where: { chatId },
      select: {
        message: true,
        time: true,
        chatId: true,
        authorId: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { time: "asc" },
    });
  }

  public static async getAllMessages(): Promise<RawMsgData[]> {
    return await this.chat.findMany({
      select: {
        message: true,
        time: true,
        chatId: true,
        authorId: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ time: "desc" }],
    });
  }
}
