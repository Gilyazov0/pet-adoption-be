import { Prisma, Pet, Event, PrismaClient } from "@prisma/client";
import SearchParams from "../Types/searchParams";
import EventModel from "./eventModel";
import PrismaModel from "./prismaModel";

export class PetModel extends PrismaModel {
  private static pet = this.client.pet;

  public static async addPet(pet: Prisma.PetCreateInput) {
    const result = await this.pet.create({ data: pet });

    return result;
  }

  public static async updatePet(pet: Prisma.PetUpdateInput, id: number) {
    const result = await this.pet.update({
      where: { id },
      data: { ...pet },
    });
    return result;
  }

  public static async getPetById(id: number): Promise<Pet | null> {
    const pet = await this.pet.findFirst({ where: { id } });
    return pet;
  }
  
  public static async getPetsByIds(ids: number[]): Promise<Pet[]> {
    const pet = await this.pet.findMany({ where: { id: { in: ids } } });
    return pet;
  }

  public static async search(params: SearchParams) {
    const { name, type, maxWeight, minWeight, maxHeight, minHeight, status } = {
      ...params,
    };

    return await this.pet.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(status ? { adoptionStatus: status } : {}),
        weight: { lte: maxWeight, gte: minWeight },
        height: { lte: maxHeight, gte: minHeight },
        ...(name ? { name: { search: `${name}*` } } : {}),
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
