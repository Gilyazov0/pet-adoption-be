import { Prisma } from "@prisma/client";
import PrismaModel from "./prismaModel";

export default class IssueModel extends PrismaModel {
  private static issue = this.client.issue;

  public static async addIssue(data: Prisma.IssueUncheckedCreateInput) {
    return await this.issue.create({ data });
  }

  public static async getAllIssues() {
    return await this.issue.findMany({
      include: {
        comments: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { time: "asc" },
        },
        author: true,
      },
    });
  }

  public static async delIssue(id: number) {
    return await this.issue.delete({ where: { id } });
  }
}
