"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../exceptions/AppError");
const eventModel_1 = __importDefault(require("../model/eventModel"));
const petModel_1 = require("../model/petModel");
const userModel_1 = __importDefault(require("../model/userModel"));
class PetController {
    static dataPreparation(req) {
        const data = req.body.data;
        if (!data)
            throw new AppError_1.AppError({
                description: "Bad request body",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            });
        data.picture = req.file ? req.file.path : data.picture;
        data.height = Number(data.height);
        data.weight = Number(data.weight);
        if (data.ownerId)
            data.ownerId = Number(data.ownerId);
        data.hypoallergenic = Boolean(data.hypoallergenic);
        return req;
    }
}
exports.default = PetController;
_a = PetController;
PetController.getPetById = async (req, res) => {
    const id = Number(req.query.id);
    if (!id)
        throw new AppError_1.AppError({
            description: "Invalid params",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        });
    const pet = await petModel_1.PetModel.getPetById(id);
    if (pet)
        res.send(pet);
    else {
        throw new AppError_1.AppError({
            description: "user not found",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        });
    }
};
PetController.addPet = async (req, res) => {
    req = _a.dataPreparation(req);
    const pet = await petModel_1.PetModel.addPet(req.body.data);
    eventModel_1.default.AddEvent({
        authorId: req.body.tokenData.id,
        type: "NewPet",
        newStatus: pet.adoptionStatus,
        petId: pet.id,
    });
    res.send(pet);
};
PetController.updatePet = async (req, res) => {
    req = _a.dataPreparation(req);
    const data = req.body.data;
    const id = Number(data.id);
    if (!data.picture)
        delete data.picture;
    delete data.id;
    const prevPet = await petModel_1.PetModel.getPetById(id);
    let newStatus = undefined;
    if (data.adoptionStatus === "Available" &&
        (prevPet === null || prevPet === void 0 ? void 0 : prevPet.adoptionStatus) !== "Available") {
        newStatus = "Available";
        if ((prevPet === null || prevPet === void 0 ? void 0 : prevPet.adoptionStatus) === "Adopted")
            userModel_1.default.changeAdopt(prevPet.ownerId, id);
        if ((prevPet === null || prevPet === void 0 ? void 0 : prevPet.adoptionStatus) === "Fostered")
            userModel_1.default.changeFoster(prevPet.ownerId, id);
    }
    delete data.adoptionStatus;
    const pet = await petModel_1.PetModel.updatePet(req.body.data, id);
    const event = {
        authorId: req.body.tokenData.id,
        type: "PetUpdate",
        petId: pet.id,
    };
    if (newStatus)
        event.newStatus;
    eventModel_1.default.AddEvent(event);
    res.send(pet);
};
PetController.search = async (req, res) => {
    const data = req.query;
    const params = {
        ...data,
        maxWeight: Number(data.maxWeight)
            ? Number(data.maxWeight)
            : Number.MAX_VALUE,
        minWeight: Number(data.minWeight)
            ? Number(data.minWeight)
            : Number.MIN_VALUE,
        maxHeight: Number(data.maxHeight)
            ? Number(data.maxHeight)
            : Number.MAX_VALUE,
        minHeight: Number(data.minHeight)
            ? Number(data.minHeight)
            : Number.MIN_VALUE,
    };
    const pets = await petModel_1.PetModel.search(params);
    res.send(pets);
};
//# sourceMappingURL=pet.js.map