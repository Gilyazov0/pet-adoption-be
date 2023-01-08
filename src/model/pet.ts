import { PrismaClient, Prisma, Pet, Event } from "@prisma/client";
import SearchParams from "../Types/searchParams";
import { getNewPetEventsModel } from "./event";

const prisma = new PrismaClient();

export async function addPetModel(pet: Prisma.PetCreateInput) {
  const result = await prisma.pet.create({ data: pet });

  return result;
}
export async function updatePetModel(pet: Prisma.PetUpdateInput, id: number) {
  const result = await prisma.pet.update({
    where: { id },
    data: { ...pet },
  });
  return result;
}

export async function getPetByIdModel(id: number): Promise<Pet | null> {
  const pet = await prisma.pet.findFirst({ where: { id } });
  return pet;
}

export async function searchModel(params: SearchParams) {
  const { name, type, weight, height, status } = { ...params };

  if (name)
    return await prisma.pet.findMany({
      where: {
        name: { search: `${name}*` },
        type,
        weight: weight ? weight : undefined,
        height: height ? height : undefined,
        adoptionStatus: status,
      },
    });
  else
    return await prisma.pet.findMany({
      where: {
        type,
        weight: weight ? weight : undefined,
        height: height ? height : undefined,
        adoptionStatus: status,
      },
    });
}

export async function getNewPetsModel(userId: number): Promise<(Pet | null)[]> {
  const events = await getNewPetEventsModel(userId);
  const promises = [];
  for (const event of events) {
    if (event.petId) promises.push(getPetByIdModel(event.petId));
  }
  const pets = await Promise.all(promises);

  return pets;
}
