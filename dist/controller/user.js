"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFoster = exports.toggleAdopt = exports.toggleSave = exports.update = exports.login = exports.createUser = void 0;
const user_1 = require("../model/user");
const createUser = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    const user = await (0, user_1.createUserModel)(firstName, lastName, email, phone, password);
    res.send(user);
};
exports.createUser = createUser;
const login = async (req, res) => {
    const { email, password } = req.query;
    const user = await (0, user_1.loginModel)(email, password);
    res.send(user);
};
exports.login = login;
const update = async (req, res) => {
    const data = req.body;
    const user = await (0, user_1.updateModel)(data);
    res.send(user);
};
exports.update = update;
const toggleSave = async (req, res) => {
    const { userId, petId } = req.body;
    const user = await (0, user_1.toggleSaveModel)(userId, petId);
    res.send(user);
};
exports.toggleSave = toggleSave;
const toggleAdopt = async (req, res) => {
    const { userId, petId } = req.body;
    const user = await (0, user_1.toggleAdoptModel)(userId, petId);
    res.send(user);
};
exports.toggleAdopt = toggleAdopt;
const toggleFoster = async (req, res) => {
    const { userId, petId } = req.body;
    const user = await (0, user_1.toggleFosterModel)(userId, petId);
    res.send(user);
};
exports.toggleFoster = toggleFoster;
//# sourceMappingURL=user.js.map