"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFosterModel = exports.toggleAdoptModel = exports.toggleSaveModel = exports.updateModel = exports.loginModel = exports.createUserModel = void 0;
const pet_1 = require("./pet");
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
async function createUserModel(firstName, lastName, email, phone, password) {
    if (password === "error")
        throw new Error("terrible error happened");
    return USER;
}
exports.createUserModel = createUserModel;
async function loginModel(email, password) {
    if (password === "error")
        throw new Error("terrible error happened");
    return USER;
}
exports.loginModel = loginModel;
async function updateModel(data) {
    USER = { ...USER, ...data };
    return USER;
}
exports.updateModel = updateModel;
async function toggleSaveModel(userId, petId) {
    const savedPets = USER.savedPets.includes(petId)
        ? USER.savedPets.filter((id) => id !== petId)
        : [...USER.savedPets, petId];
    USER.savedPets = savedPets;
    return { ...USER, savedPets };
}
exports.toggleSaveModel = toggleSaveModel;
async function toggleAdoptModel(userId, petId) {
    const pet = (0, pet_1.getPetByIdModel)(petId);
    if (USER.id === pet.adoptedBy) {
        const myPets = USER.myPets.filter((id) => id !== petId);
        USER = { ...USER, myPets };
        pet.adoptedBy = "";
        pet.adoptionStatus = "Available";
    }
    else {
        const myPets = [...USER.myPets, petId];
        USER = { ...USER, myPets };
        pet.adoptedBy = USER.id;
        pet.fosteredBy = "";
        pet.adoptionStatus = "Adopted";
    }
    return { ...USER };
}
exports.toggleAdoptModel = toggleAdoptModel;
async function toggleFosterModel(userId, petId) {
    const pet = (0, pet_1.getPetByIdModel)(petId);
    if (USER.id === pet.fosteredBy) {
        const myPets = USER.myPets.filter((id) => id !== petId);
        USER = { ...USER, myPets };
        pet.fosteredBy = "";
        pet.adoptionStatus = "Available";
    }
    else {
        const myPets = [...USER.myPets, petId];
        USER = { ...USER, myPets };
        pet.fosteredBy = USER.id;
        pet.adoptionStatus = "Fostered";
    }
    return { ...USER };
}
exports.toggleFosterModel = toggleFosterModel;
//# sourceMappingURL=user.js.map