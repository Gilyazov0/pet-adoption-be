import { PrismaClient, Prisma } from "@prisma/client";
import chatId from "../Schemas/chatId";
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
export default class ChatModel {
  private static prisma = new PrismaClient();
  private static chatModel = this.prisma.chat;

  public static async delChat(chatId: number) {
    return await this.chatModel.deleteMany({ where: { chatId } });
  }
  public static async addMessage(msg: Prisma.ChatUncheckedCreateInput) {
    return await this.chatModel.create({ data: msg });
  }

  public static async getChatById(chatId: number): Promise<RawMsgData[]> {
    return await this.chatModel.findMany({
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
      orderBy: { time: "desc" },
    });
  }

  public static async getAllMessages(): Promise<RawMsgData[]> {
    return await this.chatModel.findMany({
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
