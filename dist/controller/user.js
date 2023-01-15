"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../exceptions/AppError");
require("dotenv/config");
const eventModel_1 = require("../model/eventModel");
const petModel_1 = require("../model/petModel");
const userModel_1 = __importDefault(require("../model/userModel"));
class UserController {
    static delPassword(data) {
        delete data.password;
        return data;
    }
}
exports.default = UserController;
_a = UserController;
UserController.getAllUsers = async (req, res) => {
    const users = await userModel_1.default.getAllUsers();
    for (const user of users)
        _a.delPassword(user);
    res.send(users);
};
UserController.getUserById = async (req, res) => {
    const id = Number(req.query.id);
    if (!id)
        throw new AppError_1.AppError({
            description: "Invalid params",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        });
    const user = await userModel_1.default.getUserById(id);
    if (user)
        res.send(_a.delPassword(user));
    else {
        throw new AppError_1.AppError({
            description: "user not found",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        });
    }
};
UserController.createUser = async (req, res) => {
    const user = await userModel_1.default.createUser(req.body.data);
    eventModel_1.EventModel.AddEvent({ authorId: user.id, type: "NewUser" });
    res.send(_a.delPassword(user));
};
UserController.login = async (req, res) => {
    const { password, user } = req.body.data;
    const result = await bcrypt_1.default.compare(password, user.password);
    if (!result)
        throw new AppError_1.AppError({
            description: "Authorization denied",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
            isOperational: true,
        });
    const tokenData = { id: user.id, isAdmin: user.isAdmin };
    const token = jsonwebtoken_1.default.sign(tokenData, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, { maxAge: 86000000, httpOnly: true });
    const newPets = await petModel_1.PetModel.getNewPets(user.id);
    const newAvailablePets = await petModel_1.PetModel.getNewAvailablePets(user.id);
    eventModel_1.EventModel.AddEvent({ authorId: user.id, type: "Login" });
    res.send({
        user: _a.delPassword(user),
        newPets,
        newAvailablePets,
    });
};
UserController.update = async (req, res) => {
    const data = req.body.data;
    if (req.body.tokenData.id !== data.userId && !req.body.tokenData.isAdmin)
        throw new AppError_1.AppError({
            description: "Authorized request",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
        });
    const user = await userModel_1.default.update(data.data, data.userId);
    res.send(_a.delPassword(user));
};
UserController.changeSave = async (req, res) => {
    const { petId } = req.body.data;
    const user = await userModel_1.default.changeSave(req.body.tokenData.id, petId);
    res.send(_a.delPassword(user));
};
UserController.changeAdopt = async (req, res) => {
    var _b;
    const { petId } = req.body.data;
    const user = await userModel_1.default.changeAdopt(req.body.tokenData.id, petId);
    const newStatus = ((_b = user.pets.find((pet) => pet.id === petId)) === null || _b === void 0 ? void 0 : _b.adoptionStatus) || "Available";
    eventModel_1.EventModel.AddEvent({
        authorId: req.body.tokenData.id,
        type: "NewPetStatus",
        petId: petId,
        newStatus,
    });
    res.send(_a.delPassword(user));
};
UserController.changeFoster = async (req, res) => {
    var _b;
    const { petId } = req.body.data;
    const user = await userModel_1.default.changeFoster(req.body.tokenData.id, petId);
    const newStatus = ((_b = user.pets.find((pet) => pet.id === petId)) === null || _b === void 0 ? void 0 : _b.adoptionStatus) || "Available";
    eventModel_1.EventModel.AddEvent({
        authorId: req.body.tokenData.id,
        type: "NewPetStatus",
        petId: petId,
        newStatus,
    });
    res.send(_a.delPassword(user));
};
//# sourceMappingURL=user.js.map