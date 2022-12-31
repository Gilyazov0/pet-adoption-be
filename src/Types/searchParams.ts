import { AdoptStatus, PetType } from "@prisma/client";

export default interface SearchParams {
  name?: string;
  type?: PetType;
  weight?: number;
  height?: number;
  status?: AdoptStatus;
}
