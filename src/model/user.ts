import User from "../Types/User";
import { getPetByIdModel } from "./pet";
import { UpdatePayload } from "../controller/user";

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
  return USER.email === email ? USER : null;
}

export async function createUserModel(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
): Promise<User> {
  if (password === "error") throw new Error("terrible error happened");
  return USER;
}

export async function loginModel(
  email: string,
  password: string
): Promise<User> {
  if (password === "error") throw new Error("terrible error happened");
  return USER;
}

export async function updateModel(data: UpdatePayload): Promise<User> {
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

export async function toggleAdoptModel(userId: string, petId: string) {
  const pet = getPetByIdModel(petId);

  if (USER.id === pet.adoptedBy) {
    const myPets = USER.myPets.filter((id) => id !== petId);
    USER = { ...USER, myPets };
    pet.adoptedBy = "";
    pet.adoptionStatus = "Available";
  } else {
    const myPets = [...USER.myPets, petId];
    USER = { ...USER, myPets };
    pet.adoptedBy = USER.id;
    pet.fosteredBy = "";
    pet.adoptionStatus = "Adopted";
  }

  return { ...USER };
}
export async function toggleFosterModel(userId: string, petId: string) {
  const pet = getPetByIdModel(petId);

  if (USER.id === pet.fosteredBy) {
    const myPets = USER.myPets.filter((id) => id !== petId);
    USER = { ...USER, myPets };
    pet.fosteredBy = "";
    pet.adoptionStatus = "Available";
  } else {
    const myPets = [...USER.myPets, petId];
    USER = { ...USER, myPets };
    pet.fosteredBy = USER.id;
    pet.adoptionStatus = "Fostered";
  }

  return { ...USER };
}
