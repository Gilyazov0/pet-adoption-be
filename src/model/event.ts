import { PrismaClient, Prisma } from "@prisma/client";
import { type } from "os";

const prisma = new PrismaClient();

export async function AddEventModel(event: Prisma.EventUncheckedCreateInput) {
  const result = await prisma.event.create({ data: event });
  return result;
}

export async function getNewsfeedModel() {
  const result = await prisma.event.findMany({
    where: { type: { in: ["NewUser", "NewPet", "PetUpdate", "NewPetStatus"] } },
    orderBy: { time: "desc" },
    include: { author: true, pet: true },
  });
  return result;
}
