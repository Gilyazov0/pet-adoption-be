import { PrismaClient, Prisma, Pet, Event } from "@prisma/client";
import SearchParams from "../Types/searchParams";
import EventModel from "./eventModel";

export class PetModel {
  private static prisma = new PrismaClient();
  private static petModel = this.prisma.pet;

  public static async addPet(pet: Prisma.PetCreateInput) {
    const result = await this.petModel.create({ data: pet });

    return result;
  }

  public static async updatePet(pet: Prisma.PetUpdateInput, id: number) {
    const result = await this.petModel.update({
      where: { id },
      data: { ...pet },
    });
    return result;
  }

  public static async getPetById(id: number): Promise<Pet | null> {
    const pet = await this.petModel.findFirst({ where: { id } });
    return pet;
  }
  public static async getPetsByIds(ids: number[]): Promise<Pet[]> {
    const pet = await this.petModel.findMany({ where: { id: { in: ids } } });
    return pet;
  }

  public static async search(params: SearchParams) {
    const { name, type, weight, height, status } = { ...params };

    if (name)
      return await this.petModel.findMany({
        where: {
          name: { search: `${name}*` },
          type,
          weight: weight ? weight : undefined,
          height: height ? height : undefined,
          adoptionStatus: status,
        },
      });
    else
      return await this.petModel.findMany({
        where: {
          type,
          weight: weight ? weight : undefined,
          height: height ? height : undefined,
          adoptionStatus: status,
        },
      });
  }

  public static async getNewPets(userId: number) {
    const newPetsEvents = await EventModel.getNewPetEvents(userId);

    const ids: number[] = [];
    for (const event of newPetsEvents) {
      if (event.petId) ids.push(event.petId);
    }

    const newPets = await this.getPetsByIds(ids);

    return newPets;
  }

  public static async getNewAvailablePets(userId: number) {
    const newAvailableEvents = await EventModel.getNewAvailablePetsEvents(
      userId
    );

    const ids = new Set<number>();
    for (const event of newAvailableEvents) {
      if (event.petId) ids.add(event.petId);
    }

    const newAvailablePets = await this.getPetsByIds(Array.from(ids));

    return newAvailablePets.filter((pet) => pet.adoptionStatus === "Available");
  }
}

export default PetModel;
