import Pets from "../PetsDataSet.json";
import Pet from "../Types/Pet";

const pets = Pets.map((pet, i) => {
  return { ...pet, id: i.toString(), dietary: "" };
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
    if (type && x.type != type) return false;
    if (weight && x.weight !== Number(weight)) return false;
    if (height && x.height !== Number(height)) return false;
    if (status && x.adoptionStatus != status) return false;
    return true;
  });
}
