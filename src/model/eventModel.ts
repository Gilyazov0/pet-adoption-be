import { PrismaClient, Prisma } from "@prisma/client";

export class EventModel {
  private static prisma = new PrismaClient();
  private static eventModel = this.prisma.event;

  public static async AddEvent(event: Prisma.EventUncheckedCreateInput) {
    const result = await this.eventModel.create({ data: event });
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

    const result = await this.eventModel.findMany({
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

    const newPetsEvents = await this.eventModel.findMany({
      where: { type: "NewPet", time: { gt: lastLogin } },
    });
    return newPetsEvents;
  }

  public static async getNewAvailablePetsEvents(userId: number) {
    const lastLogin = await this.getLastLoginDate(userId);

    if (!lastLogin) return [];

    const events = await this.eventModel.findMany({
      where: {
        type: { in: ["PetUpdate", "NewPetStatus"] },
        newStatus: "Available",
        time: { gt: lastLogin },
      },
    });
    return events;
  }

  private static async getLastLoginDate(userId: number) {
    const lastLogin = await this.eventModel.findFirst({
      where: { authorId: userId, type: "Login" },
      orderBy: { time: "desc" },
      select: { time: true },
    });
    return lastLogin?.time;
  }
}

export default EventModel;
