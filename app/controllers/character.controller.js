"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const character_service_1 = __importDefault(require("../services/character.service"));
class CharacterController {
    handleFetchCharacters(_req, res, next) {
        character_service_1.default.getAndSaveCharacters()
            .then((result) => res.json(result))
            .catch((err) => next(err));
    }
}
exports.default = new CharacterController();
