"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchModel = exports.getPetsByIdsModel = exports.getPetByIdModel = void 0;
const PetsDataSet_json_1 = __importDefault(require("../PetsDataSet.json"));
const pets = PetsDataSet_json_1.default.map((pet, i) => {
    return { ...pet, id: i.toString(), dietary: "" };
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
        if (type && x.type != type)
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
//# sourceMappingURL=pet.js.map