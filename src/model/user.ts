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
    include: { saved_pets: true, pets: true },
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

async function getPetAndUserById(userId: number, petId: number) {
  const [user, pet] = await Promise.all([
    getUserById(userId),
    getPetByIdModel(petId),
  ]);

  if (!user) throw new Error("Wrong user id");
  if (!pet) throw new Error("Wrong pet id");

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

//   if (pet.owner_id && pet.owner_id !== user.id)
//     throw new Error("Pet have another owner");
//   if (!isAdopting && pet.adoptionStatus !== "Adopted")

//   throw new Error("Wrong pet status");
// const data = pet.owner_id
//   ? { owner_id: null, adoptionStatus: "Available" }
//   : { owner_id: userId, adoptionStatus: "Adopted" };

// }

export async function toggleAdoptModel(userId: number, petId: number) {
  let { pet, user } = await getPetAndUserById(userId, petId);

  if (pet.owner_id && pet.owner_id !== user.id)
    throw new Error("Pet have another owner");

  const data =
    pet.adoptionStatus === "Adopted"
      ? { owner_id: null, adoptionStatus: "Available" }
      : { owner_id: userId, adoptionStatus: "Adopted" };

  pet = await prisma.pet.update({
    where: { id: petId },
    data: { ...data },
  });

  const pets = pet.owner_id
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

  if (pet.owner_id && pet.owner_id !== user.id)
    throw new Error("Pet have another owner");

  if (pet.adoptionStatus === "Adopted")
    throw new Error("Wrong pet adoption status");

  const data =
    pet.adoptionStatus === "Fostered"
      ? { owner_id: null, adoptionStatus: "Available" }
      : { owner_id: userId, adoptionStatus: "Fostered" };

  const newPet = await prisma.pet.update({
    where: { id: petId },
    data: { ...data },
  });

  const pets = newPet.owner_id
    ? [...user.pets, pet]
    : user.pets.filter((pet) => pet.id !== petId);
  return { user, pets };
}
