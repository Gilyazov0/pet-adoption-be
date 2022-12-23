"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetById = void 0;
const pet_1 = require("../model/pet");
const getPetById = (req, res) => {
    const id = req.params.id;
    const pet = (0, pet_1.getPetByIdModel)(id);
    res.send(pet);
};
exports.getPetById = getPetById;
