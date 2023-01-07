import { PrismaClient, Prisma, Pet } from "@prisma/client";
import SearchParams from "../Types/searchParams";

const prisma = new PrismaClient();

export async function addPetModel(pet: Prisma.PetCreateInput) {
  const result = await prisma.pet.create({ data: pet });

  return result;
}
export async function updatePetModel(pet: Prisma.PetCreateInput, id: number) {
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
