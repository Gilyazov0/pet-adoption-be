import Pets from "../PetsDataSet.json";
import { AdoptStatus } from "../Types/AdoptStatus";
import Pet from "../Types/Pet";
import { PetType } from "../Types/PetsTypes";

const pets = Pets.map((pet, i) => {
  const type =
    pet.type === "Dog"
      ? PetType.Dog
      : pet.type === "Cat"
      ? PetType.Cat
      : PetType.Other;

  return { ...pet, id: i.toString(), type };
}) as Pet[];

export function getPetByIdModel(id: string): Pet {
  return pets[Number(id)];
}

export async function getPetsByIdsModel(ids: string[]) {
  return ids.map((id) => getPetByIdModel(id));
}

export async function searchModel(
  name?: string,
  type?: string,
  weight?: string,
  height?: string,
  status?: string
) {
  return pets.filter((x) => {
    if (name && x.name != name) return false;
    if (type && PetType[x.type] != type) return false;
    if (weight && x.weight !== Number(weight)) return false;
    if (height && x.height !== Number(height)) return false;
    if (status && x.adoptionStatus != status) return false;
    return true;
  });
}
