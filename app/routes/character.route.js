"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const character_controller_1 = __importDefault(require("../controllers/character.controller"));
class CharacterRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.createRoutes();
    }
    createRoutes() {
        this.router.get('/fetch-characters-data', character_controller_1.default.handleFetchCharacters.bind(this));
    }
}
exports.default = new CharacterRoute().router;
