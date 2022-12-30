import { getPetByIdModel } from "./pet";
import { UpdatePayload } from "../controller/user";
import { PrismaClient, Prisma, AdoptStatus, User, Pet } from "@prisma/client";
import { AppError, HttpCode } from "../exceptions/AppError";

const prisma = new PrismaClient();

type UserReturnType = Promise<
  | (User & {
      savedPets: Pet[];
      pets: Pet[];
    })
  | null
>;

export async function getUserByEmail(email: string): UserReturnType {
  return await prisma.user.findFirst({
    where: { email },
    include: { savedPets: true, pets: true },
  });
}

export async function getUserById(id: number): UserReturnType {
  return await prisma.user.findFirst({
    where: { id },
    include: { savedPets: true, pets: true },
  });
}

export async function createUserModel(
  user: Prisma.UserCreateInput
): UserReturnType {
  const result = await prisma.user.create({ data: user });
  return { ...result, savedPets: [], pets: [] };
}

export async function loginModel(
  email: string,
  password: string
): UserReturnType {
  const user = await getUserByEmail(email);
  if (user && password === user.password) return user;
  else
    throw new AppError({
      description: "Authorization denied",
      httpCode: HttpCode.UNAUTHORIZED,
    });
}

export async function updateModel(data: UpdatePayload): UserReturnType {
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

export async function toggleSaveModel(
  userId: number,
  petId: number
): UserReturnType {
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

export async function toggleAdoptModel(
  userId: number,
  petId: number
): UserReturnType {
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

  return { ...user, pets };
}

export async function toggleFosterModel(
  userId: number,
  petId: number
): UserReturnType {
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
  return { ...user, pets };
}
