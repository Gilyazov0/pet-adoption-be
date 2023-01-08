import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function AddEventModel(event: Prisma.EventUncheckedCreateInput) {
  const result = await prisma.event.create({ data: event });
  return result;
}

export async function getNewsfeedModel(
  startDate: Date | null = null,
  endDate: Date | null = null
) {
  if (!startDate || !endDate) {
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
  }

  const result = await prisma.event.findMany({
    where: {
      type: { in: ["NewUser", "NewPet", "PetUpdate", "NewPetStatus"] },
      time: { lt: endDate, gt: startDate },
    },
    orderBy: { time: "desc" },
    include: { author: true, pet: true },
  });
  return result;
}

export async function getNewPetEventsModel(userId: number) {
  const lastLogin = await prisma.event.findFirst({
    where: { authorId: userId, type: "Login" },
    orderBy: { time: "desc" },
    select: { time: true },
  });

  if (!lastLogin) return [];

  console.log(userId, lastLogin.time);

  const newPetsEvents = await prisma.event.findMany({
    where: { type: "NewPet", time: { gt: lastLogin.time } },
  });
  return newPetsEvents;
}
