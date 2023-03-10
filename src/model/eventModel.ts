import { Prisma } from "@prisma/client";
import PrismaModel from "./prismaModel";

export class EventModel extends PrismaModel {
  private static event = this.client.event;
  public static async AddEvent(event: Prisma.EventUncheckedCreateInput) {
    const result = await this.event.create({ data: event });
    return result;
  }

  public static async getNewsfeed(
    startDate: Date | null = null,
    endDate: Date | null = null
  ) {
    if (!startDate || !endDate) {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
    }

    const result = await this.event.findMany({
      where: {
        type: { in: ["NewUser", "NewPet", "PetUpdate", "NewPetStatus"] },
        time: { lt: endDate, gt: startDate },
      },
      orderBy: { time: "desc" },
      include: { author: true, pet: true },
    });
    return result;
  }

  public static async getNewPetEvents(userId: number) {
    const lastLogin = await this.getLastLoginDate(userId);

    if (!lastLogin) return [];

    const newPetsEvents = await this.event.findMany({
      where: { type: "NewPet", time: { gt: lastLogin } },
    });
    return newPetsEvents;
  }

  public static async getNewAvailablePetsEvents(userId: number) {
    const lastLogin = await this.getLastLoginDate(userId);

    if (!lastLogin) return [];

    const events = await this.event.findMany({
      where: {
        type: { in: ["PetUpdate", "NewPetStatus"] },
        newStatus: "Available",
        time: { gt: lastLogin },
      },
    });
    return events;
  }

  private static async getLastLoginDate(userId: number) {
    const lastLogin = await this.event.findFirst({
      where: { authorId: userId, type: "Login" },
      orderBy: { time: "desc" },
      select: { time: true },
    });
    return lastLogin?.time;
  }
}

export default EventModel;
