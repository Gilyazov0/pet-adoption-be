"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getPetByIds = exports.getPetById = void 0;
const pet_1 = require("../model/pet");
const getPetById = async (req, res) => {
    const id = req.params.id;
    const pet = await (0, pet_1.getPetByIdModel)(id);
    res.send(pet);
};
exports.getPetById = getPetById;
const getPetByIds = async (req, res) => {
    const ids = req.query.ids;
    const pets = await (0, pet_1.getPetsByIdsModel)(ids);
    res.send(pets);
};
exports.getPetByIds = getPetByIds;
const search = async (req, res) => {
    const { name, type, weight, height, status } = req.query;
    const pets = await (0, pet_1.searchModel)(name, type, weight, height, status);
    res.send(pets);
};
exports.search = search;
//# sourceMappingURL=pet.js.map