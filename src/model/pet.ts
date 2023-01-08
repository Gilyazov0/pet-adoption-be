import { PrismaClient, Prisma, Pet, Event } from "@prisma/client";
import SearchParams from "../Types/searchParams";
import EventModel from "./event";

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
export async function getPetsByIdsModel(ids: number[]): Promise<Pet[]> {
  const pet = await prisma.pet.findMany({ where: { id: { in: ids } } });
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

export async function getNewPetsModel(userId: number) {
  const newPetsEvents = await EventModel.getNewPetEvents(userId);

  const ids: number[] = [];
  for (const event of newPetsEvents) {
    if (event.petId) ids.push(event.petId);
  }

  const newPets = await getPetsByIdsModel(ids);

  return newPets;
}

export async function getNewAvailablePetsModel(userId: number) {
  const newAvailableEvents = await EventModel.getNewAvailablePetsEvents(userId);

  const ids = new Set<number>();
  for (const event of newAvailableEvents) {
    if (event.petId) ids.add(event.petId);
  }

  const newAvailablePets = await getPetsByIdsModel(Array.from(ids));

  return newAvailablePets.filter((pet) => (pet.adoptionStatus = "Available"));
}
