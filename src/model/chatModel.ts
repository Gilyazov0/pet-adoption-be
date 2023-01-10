import { PrismaClient, Prisma } from "@prisma/client";

export default class ChatModel {
  private static prisma = new PrismaClient();
  private static chatModel = this.prisma.chat;

  public static async addMessage(msg: Prisma.ChatUncheckedCreateInput) {
    const res = await this.chatModel.create({ data: msg });
    return res;
  }

  public static async getAllMessages() {
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
      orderBy: [{ time: "asc" }],
    });
  }
}
