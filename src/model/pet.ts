import Pets from "../PetsDataSet.json";
import Pet from "../Types/Pet";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// const pets = Pets.map((pet, i) => {
//   return { ...pet, id: i.toString(), dietary: "" };
// }) as Pet[];

export async function addPetModel(pet: Prisma.PetCreateInput) {
  const result = await prisma.pet.create({ data: pet });
  return result;
}

export async function getPetByIdModel(id: number) {
  const pet = await prisma.pet.findFirst({ where: { id } });
  return pet;
}

export async function getPetsByIdsModel(ids: number[]) {
  const pets = await prisma.pet.findMany({ where: { id: { in: ids } } });
  return pets;
}

export async function searchModel(
  name?: string,
  type?: string,
  weight?: string,
  height?: string,
  status?: string
) {
  throw new Error("not implemented yet");
  // return pets.filter((x) => {
  //   if (name && x.name != name) return false;
  //   if (type && x.type != type) return false;
  //   if (weight && x.weight !== Number(weight)) return false;
  //   if (height && x.height !== Number(height)) return false;
  //   if (status && x.adoptionStatus != status) return false;
  //   return true;
  // });
}
