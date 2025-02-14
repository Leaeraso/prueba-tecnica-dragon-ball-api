"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../config/index"));
const axios_1 = __importDefault(require("axios"));
const character_schema_1 = __importDefault(require("../models/schemas/character.schema"));
class CharacterService {
    getAndSaveCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let characters = [];
            let totalPages = 1;
            const races = new Map();
            while (page <= totalPages) {
                const response = yield axios_1.default.get(`${index_1.default.FETCH_URI}?page=${page}`);
                if (!response.data || !response.data.meta) {
                    throw new Error('Invalid API response');
                }
                if (page === 1) {
                    totalPages = response.data.meta.totalPages;
                }
                const pageCharacters = response.data.items.map((character) => ({
                    id: character.id,
                    name: character.name,
                    ki: character.ki,
                    maxKi: character.maxKi,
                    race: character.race,
                    gender: character.gender,
                    description: character.description,
                    image: character.image,
                }));
                response.data.items.forEach((c) => {
                    races.set(c.race, c.race);
                });
                characters = [...characters, ...pageCharacters];
                page++;
            }
            console.log('Races: ', races);
            yield character_schema_1.default.insertMany(characters);
            return { message: 'Data obtained and saved successfully' };
        });
    }
}
exports.default = new CharacterService();
