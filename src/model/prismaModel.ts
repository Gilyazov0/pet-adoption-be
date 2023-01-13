import { PrismaClient } from "@prisma/client";
export default class PrismaModel {
  static client = new PrismaClient();
}
