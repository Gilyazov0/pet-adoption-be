"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFosterModel = exports.toggleAdoptModel = exports.toggleSaveModel = exports.loginModel = exports.createUserModel = void 0;
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
    if (USER.myPets.includes(petId)) {
        const myPets = USER.myPets.filter((id) => id !== petId);
        USER = { ...USER, myPets };
        pet.adoptedBy = "";
        pet.adoptionStatus = "Available";
    }
    else {
        const myPets = [...USER.myPets, petId];
        USER = { ...USER, myPets };
        pet.adoptedBy = USER.id;
        pet.adoptionStatus = "Adopted";
    }
    return { ...USER };
}
exports.toggleAdoptModel = toggleAdoptModel;
async function toggleFosterModel(userId, petId) {
    const pet = (0, pet_1.getPetByIdModel)(petId);
    if (USER.myPets.includes(petId)) {
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
