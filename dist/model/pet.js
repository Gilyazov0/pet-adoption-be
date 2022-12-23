"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchModel = exports.getPetsByIdsModel = exports.getPetByIdModel = void 0;
const PetsDataSet_json_1 = __importDefault(require("../PetsDataSet.json"));
const PetsTypes_1 = require("../Types/PetsTypes");
const pets = PetsDataSet_json_1.default.map((pet, i) => {
    const type = pet.type === "Dog"
        ? PetsTypes_1.PetType.Dog
        : pet.type === "Cat"
            ? PetsTypes_1.PetType.Cat
            : PetsTypes_1.PetType.Other;
    return { ...pet, id: i.toString(), type };
});
function getPetByIdModel(id) {
    return pets[Number(id)];
}
exports.getPetByIdModel = getPetByIdModel;
async function getPetsByIdsModel(ids) {
    return ids.map((id) => getPetByIdModel(id));
}
exports.getPetsByIdsModel = getPetsByIdsModel;
async function searchModel(name, type, weight, height, status) {
    return pets.filter((x) => {
        if (name && x.name != name)
            return false;
        if (type && PetsTypes_1.PetType[x.type] != type)
            return false;
        if (weight && x.weight !== Number(weight))
            return false;
        if (height && x.height !== Number(height))
            return false;
        if (status && x.adoptionStatus != status)
            return false;
        return true;
    });
}
exports.searchModel = searchModel;
