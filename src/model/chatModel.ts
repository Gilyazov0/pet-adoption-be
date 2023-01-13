import { Prisma, PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";

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

console.log("Chat module: ", prismaClient === undefined);
console.trace();

export default class ChatModel {
  private static prisma = prismaClient;

  public static async delChat(chatId: number) {
    return await this.prisma.chat.deleteMany({ where: { chatId } });
  }
  public static async addMessage(msg: Prisma.ChatUncheckedCreateInput) {
    return await this.prisma.chat.create({ data: msg });
  }

  public static async getChatById(chatId: number): Promise<RawMsgData[]> {
    return await this.prisma.chat.findMany({
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
    return await this.prisma.chat.findMany({
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
