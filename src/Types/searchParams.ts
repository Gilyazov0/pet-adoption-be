import { AdoptStatus, PetType } from "@prisma/client";

export default interface SearchParams {
  name?: string;
  type?: PetType;
  maxWeight?: number;
  minWeight?: number;
  maxHeight?: number;
  minHeight?: number;
  status?: AdoptStatus;
}
