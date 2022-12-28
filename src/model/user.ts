import { getPetByIdModel } from "./pet";
import { UpdatePayload } from "../controller/user";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: { email },
    include: { saved_pets: true, pets: true },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findFirst({
    where: { id },
    include: { saved_pets: true },
  });
}

export async function createUserModel(user: Prisma.UserCreateInput) {
  const result = await prisma.user.create({ data: user });
  return result;
}

export async function loginModel(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (user) return user;
  else throw new Error("Authorization denied");
}

export async function updateModel(data: UpdatePayload) {
  throw new Error("Not implemented yet");
}

export async function toggleSaveModel(userId: number, petId: number) {
  const [user, pet] = await Promise.all([
    getUserById(userId),
    getPetByIdModel(petId),
  ]);

  if (!user) throw new Error("Wrong user id");
  if (!pet) throw new Error("Wrong pet id");

  const saved_pets =
    user.saved_pets.findIndex((pet) => pet.id === petId) === -1
      ? [...user.saved_pets, pet]
      : user.saved_pets.filter((pet) => pet.id !== petId);

  const ids = saved_pets.map((pet) => ({ id: pet.id }));

  await prisma.user.update({
    where: { id: userId },
    data: {
      saved_pets: { set: ids },
    },
  });

  return { ...user, saved_pets };
}

export async function toggleAdoptModel(userId: string, petId: number) {
  throw new Error("not implemented yet");
  const pet = getPetByIdModel(petId);

  // if (USER.id === pet.adoptedBy) {
  //   const myPets = USER.myPets.filter((id) => id !== petId);
  //   USER = { ...USER, myPets };
  //   pet.adoptedBy = "";
  //   pet.adoptionStatus = "Available";
  // } else {
  //   const myPets = [...USER.myPets, petId];
  //   USER = { ...USER, myPets };
  //   pet.adoptedBy = USER.id;
  //   pet.fosteredBy = "";
  //   pet.adoptionStatus = "Adopted";
  // }

  //return { ...USER };
}
export async function toggleFosterModel(userId: string, petId: number) {
  throw new Error("not implemented yet");

  const pet = getPetByIdModel(petId);

  // if (USER.id === pet.fosteredBy) {
  //   const myPets = USER.myPets.filter((id) => id !== petId);
  //   USER = { ...USER, myPets };
  //   pet.fosteredBy = "";
  //   pet.adoptionStatus = "Available";
  // } else {
  //   const myPets = [...USER.myPets, petId];
  //   USER = { ...USER, myPets };
  //   pet.fosteredBy = USER.id;
  //   pet.adoptionStatus = "Fostered";
  // }

  // return { ...USER };
}
