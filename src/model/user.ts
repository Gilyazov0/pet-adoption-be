import User from "../Types/User";
import { getPetByIdModel } from "./pet";
import { UpdatePayload } from "../controller/user";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

let USER = {
  email: "example@mail.com",
  firstName: "Bob",
  lastName: "Bob",
  id: "someId",
  phone: "",
  myPets: ["1"],
  savedPets: ["2"],
  isAdmin: false,
  bio: "this is a biography",
};

export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } });
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

export async function updateModel(data: UpdatePayload): Promise<User> {
  throw new Error("Not implemented yet");
  USER = { ...USER, ...data };
  return USER;
}

export async function toggleSaveModel(userId: string, petId: string) {
  const savedPets = USER.savedPets.includes(petId)
    ? USER.savedPets.filter((id) => id !== petId)
    : [...USER.savedPets, petId];
  USER.savedPets = savedPets;
  return { ...USER, savedPets };
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

  return { ...USER };
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

  return { ...USER };
}
