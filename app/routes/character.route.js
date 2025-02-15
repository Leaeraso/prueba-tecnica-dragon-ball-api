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
        this.router.get('/characters', character_controller_1.default.handleGetCharacters.bind(this));
        this.router.get('/characters/:id', character_controller_1.default.handleGetCharacterById.bind(this));
        this.router.post('/characters', character_controller_1.default.handleCreateCharacter.bind(this));
        this.router.put('/characters/:id', character_controller_1.default.handleUpdateCharacter.bind(this));
        this.router.delete('/characters/:id', character_controller_1.default.handleDeleteCharacter.bind(this));
    }
}
exports.default = new CharacterRoute().router;
