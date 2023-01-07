import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function AddEvent(event: Prisma.EventUncheckedCreateInput) {
  const result = await prisma.event.create({ data: event });
  return result;
}
