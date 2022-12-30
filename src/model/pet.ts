import {
  PrismaClient,
  Prisma,
  AdoptStatus,
  PetType,
  Pet,
} from "@prisma/client";
import { search } from "../controller/pet";

const prisma = new PrismaClient();

export async function addPetModel(pet: Prisma.PetCreateInput) {
  const result = await prisma.pet.create({ data: pet });
  return result;
}

export async function getPetByIdModel(id: number): Promise<Pet | null> {
  const pet = await prisma.pet.findFirst({ where: { id } });
  return pet;
}

export async function getPetsByIdsModel(ids: number[]): Promise<Pet[]> {
  const pets = await prisma.pet.findMany({ where: { id: { in: ids } } });
  return pets;
}

export async function searchModel(
  name: string = "",
  type?: PetType,
  weight?: number,
  height?: number,
  status?: AdoptStatus
) {
  const pets = await prisma.pet.findMany({
    where: {
      name: { search: `${name}*` },
      type,
      weight: weight ? weight : undefined,
      height: height ? height : undefined,
      adoptionStatus: status,
    },
  });
  return pets;
}
