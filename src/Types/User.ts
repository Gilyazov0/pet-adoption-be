export default interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  myPets: string[];
  savedPets: string[];
  bio: string;
}
