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
    handleGetCharacters(req, res, next) {
        character_service_1.default.getCharacters(req.query)
            .then((result) => {
            res.json(result);
        })
            .catch((err) => next(err));
    }
    handleGetCharacterById(req, res, next) {
        character_service_1.default.getCharacterById(req.params.id)
            .then((result) => {
            res.json(result);
        })
            .catch((err) => next(err));
    }
    handleCreateCharacter(req, res, next) {
        character_service_1.default.createCharacter(req.body)
            .then((result) => {
            res.json(result);
        })
            .catch((err) => next(err));
    }
    handleUpdateCharacter(req, res, next) {
        character_service_1.default.updateCharacter(req.params.id, req.body)
            .then((result) => {
            res.json(result);
        })
            .catch((err) => next(err));
    }
    handleDeleteCharacter(req, res, next) {
        character_service_1.default.deleteCharacter(req.params.id)
            .then((result) => {
            res.json(result);
        })
            .catch((err) => next(err));
    }
}
exports.default = new CharacterController();
