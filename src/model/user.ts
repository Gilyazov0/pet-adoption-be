import { getPetByIdModel } from "./pet";
import { UpdatePayload } from "../controller/user";
import { PrismaClient, Prisma, AdoptStatus } from "@prisma/client";
import { AppError, HttpCode } from "../exceptions/AppError";

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
    include: { saved_pets: true, pets: true },
  });
}

export async function createUserModel(user: Prisma.UserCreateInput) {
  const result = await prisma.user.create({ data: user });
  return result;
}

export async function loginModel(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (user && password === user.password) return user;
  else
    throw new AppError({
      description: "Authorization denied",
      httpCode: HttpCode.UNAUTHORIZED,
    });
}

export async function updateModel(data: UpdatePayload) {
  throw new Error("Not implemented yet");
}

async function getPetAndUserById(userId: number, petId: number) {
  const [user, pet] = await Promise.all([
    getUserById(userId),
    getPetByIdModel(petId),
  ]);

  if (!user)
    throw new AppError({
      description: "Wrong user id",
      httpCode: HttpCode.BAD_REQUEST,
    });
  if (!pet)
    throw new AppError({
      description: "Wrong pet id",
      httpCode: HttpCode.BAD_REQUEST,
    });

  return { pet, user };
}

export async function toggleSaveModel(userId: number, petId: number) {
  const { pet, user } = await getPetAndUserById(userId, petId);

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

// export async function toggleOwner(
//   userId: number,
//   petId: number,
//   isAdopting: boolean
// ) {
//   const { pet, user } = await getPetAndUserById(userId, petId);

//   if (pet.ownerId && pet.ownerId !== user.id)
//     throw new Error("Pet have another owner");
//   if (!isAdopting && pet.adoptionStatus !== "Adopted")

//   throw new Error("Wrong pet status");
// const data = pet.ownerId
//   ? { ownerId: null, adoptionStatus: "Available" }
//   : { ownerId: userId, adoptionStatus: "Adopted" };

// }

export async function toggleAdoptModel(userId: number, petId: number) {
  let { pet, user } = await getPetAndUserById(userId, petId);

  if (pet.ownerId && pet.ownerId !== user.id)
    throw new Error("Pet have another owner");

  const data =
    pet.adoptionStatus === AdoptStatus.Adopted
      ? { ownerId: null, adoptionStatus: AdoptStatus.Available }
      : { ownerId: userId, adoptionStatus: AdoptStatus.Adopted };

  pet = await prisma.pet.update({
    where: { id: petId },
    data: { ...data },
  });

  const pets = pet.ownerId
    ? [...user.pets, pet]
    : user.pets.filter((pet) => pet.id !== petId);

  return { user, pets };
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
export async function toggleFosterModel(userId: number, petId: number) {
  let { pet, user } = await getPetAndUserById(userId, petId);

  if (pet.ownerId && pet.ownerId !== user.id)
    throw new AppError({
      description: "Pet have another owner",
      httpCode: HttpCode.BAD_REQUEST,
    });

  if (pet.adoptionStatus === AdoptStatus.Adopted)
    throw new AppError({
      description: "Wrong pet adoption status",
      httpCode: HttpCode.BAD_REQUEST,
    });

  const data =
    pet.adoptionStatus === AdoptStatus.Fostered
      ? { ownerId: null, adoptionStatus: AdoptStatus.Available }
      : { ownerId: userId, adoptionStatus: AdoptStatus.Fostered };

  const newPet = await prisma.pet.update({
    where: { id: petId },
    data: { ...data },
  });

  const pets = newPet.ownerId
    ? [...user.pets, pet]
    : user.pets.filter((pet) => pet.id !== petId);
  return { user, pets };
}
