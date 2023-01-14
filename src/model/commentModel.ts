import { Prisma } from "@prisma/client";
import PrismaModel from "./prismaModel";

export default class CommentModel extends PrismaModel {
  private static comment = this.client.comment;

  public static async addComment(data: Prisma.CommentUncheckedCreateInput) {
    return await this.comment.create({ data });
  }
}
