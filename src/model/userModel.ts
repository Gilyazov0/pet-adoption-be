import { Prisma, AdoptStatus, User } from "@prisma/client";
import { AppError, HttpCode } from "../exceptions/AppError";
import { prismaClient } from "../server";
import FullUserData from "../Types/FullUserData";
import { PetModel } from "./petModel";

class UserModel {
  static prisma = prismaClient;
  static userModel = this.prisma.user;

  public static async getUserByEmail(
    email: string
  ): Promise<FullUserData | null> {
    return await this.userModel.findFirst({
      where: { email },
      include: { savedPets: true, pets: true },
    });
  }

  public static async getAllUsers(): Promise<FullUserData[]> {
    return await this.userModel.findMany({
      include: { savedPets: true, pets: true },
    });
  }

  public static async getUserById(id: number): Promise<FullUserData | null> {
    return await this.userModel.findFirst({
      where: { id },
      include: { savedPets: true, pets: true },
    });
  }

  public static async createUser(
    user: Prisma.UserCreateInput
  ): Promise<FullUserData> {
    const result = await this.userModel.create({ data: user });
    return { ...result, savedPets: [], pets: [] };
  }

  public static async update(data: object, userId: number): Promise<User> {
    const user = await this.userModel.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });

    return user;
  }

  private static async getPetAndUserById(userId: number, petId: number) {
    const [user, pet] = await Promise.all([
      this.getUserById(userId),
      PetModel.getPetById(petId),
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

  public static async changeSave(
    userId: number,
    petId: number
  ): Promise<FullUserData> {
    const { pet, user } = await this.getPetAndUserById(userId, petId);

    const savedPets =
      user.savedPets.findIndex((pet) => pet.id === petId) === -1
        ? [...user.savedPets, pet]
        : user.savedPets.filter((pet) => pet.id !== petId);

    const ids = savedPets.map((pet) => ({ id: pet.id }));

    await this.userModel.update({
      where: { id: userId },
      data: {
        savedPets: { set: ids },
      },
    });

    return { ...user, savedPets };
  }

  public static async changeAdopt(
    userId: number,
    petId: number
  ): Promise<FullUserData> {
    let { pet, user } = await this.getPetAndUserById(userId, petId);

    if (pet.ownerId && pet.ownerId !== user.id)
      throw new AppError({
        description: "Pet have another owner",
        httpCode: HttpCode.BAD_REQUEST,
      });

    const data =
      pet.adoptionStatus === AdoptStatus.Adopted
        ? { ownerId: null, adoptionStatus: AdoptStatus.Available }
        : { ownerId: userId, adoptionStatus: AdoptStatus.Adopted };

    pet = await PetModel.updatePet(data, petId);

    const pets = pet.ownerId
      ? [...user.pets, pet]
      : user.pets.filter((pet) => pet.id !== petId);

    return { ...user, pets };
  }

  public static async changeFoster(
    userId: number,
    petId: number
  ): Promise<FullUserData> {
    let { pet, user } = await this.getPetAndUserById(userId, petId);

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

    const newPet = await PetModel.updatePet(data, petId);
    ({
      where: { id: petId },
      data: { ...data },
    });

    const pets = newPet.ownerId
      ? [...user.pets, newPet]
      : user.pets.filter((pet) => pet.id !== petId);
    return { ...user, pets };
  }
}

export default UserModel;
