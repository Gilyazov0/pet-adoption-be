import { getPetByIdModel } from "./pet";
import { PrismaClient, Prisma, AdoptStatus, User } from "@prisma/client";
import { AppError, HttpCode } from "../exceptions/AppError";
import FullUserData from "../Types/FullUserData";

const prisma = new PrismaClient();

export async function getUserByEmail(
  email: string
): Promise<FullUserData | null> {
  return await prisma.user.findFirst({
    where: { email },
    include: { savedPets: true, pets: true },
  });
}

export async function getAllUsersModel(): Promise<FullUserData[]> {
  return await prisma.user.findMany({
    include: { savedPets: true, pets: true },
  });
}

export async function getUserByIdModel(
  id: number
): Promise<FullUserData | null> {
  return await prisma.user.findFirst({
    where: { id },
    include: { savedPets: true, pets: true },
  });
}

export async function createUserModel(
  user: Prisma.UserCreateInput
): Promise<FullUserData> {
  const result = await prisma.user.create({ data: user });
  return { ...result, savedPets: [], pets: [] };
}

export async function updateModel(data: object, userId: number): Promise<User> {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
    },
  });

  return user;
}

async function getPetAndUserById(userId: number, petId: number) {
  const [user, pet] = await Promise.all([
    getUserByIdModel(userId),
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

export async function changeSaveModel(
  userId: number,
  petId: number
): Promise<FullUserData> {
  const { pet, user } = await getPetAndUserById(userId, petId);

  const savedPets =
    user.savedPets.findIndex((pet) => pet.id === petId) === -1
      ? [...user.savedPets, pet]
      : user.savedPets.filter((pet) => pet.id !== petId);

  const ids = savedPets.map((pet) => ({ id: pet.id }));

  await prisma.user.update({
    where: { id: userId },
    data: {
      savedPets: { set: ids },
    },
  });

  return { ...user, savedPets };
}

export async function changeAdoptModel(
  userId: number,
  petId: number
): Promise<FullUserData> {
  let { pet, user } = await getPetAndUserById(userId, petId);

  if (pet.ownerId && pet.ownerId !== user.id)
    throw new AppError({
      description: "Pet have another owner",
      httpCode: HttpCode.BAD_REQUEST,
    });

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

  return { ...user, pets };
}

export async function changeFosterModel(
  userId: number,
  petId: number
): Promise<FullUserData> {
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
    ? [...user.pets, newPet]
    : user.pets.filter((pet) => pet.id !== petId);
  return { ...user, pets };
}
