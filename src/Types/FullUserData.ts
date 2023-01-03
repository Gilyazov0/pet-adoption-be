import { Pet, User } from "@prisma/client";

type FullUserData = User & {
  savedPets: Pet[];
  pets: Pet[];
};

export default FullUserData;
