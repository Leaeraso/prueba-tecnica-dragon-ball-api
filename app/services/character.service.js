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
const pagination_utils_1 = require("../utils/pagination.utils");
const errors_1 = require("../config/errors");
const messages_enum_1 = require("../config/errors/messages.enum");
const suffixes_enum_1 = require("../data/enums/suffixes.enum");
const parseKi = (ki) => {
    const normalizedKi = ki.toLowerCase().replace(/[,.]/g, '');
    if (!isNaN(Number(normalizedKi))) {
        return Number(normalizedKi);
    }
    const match = normalizedKi.match(/^([\d\.]+)\s*([a-zA-Z]+)$/);
    if (match) {
        const numberPart = parseFloat(match[1]);
        const suffix = match[2];
        if (suffixes_enum_1.SuffixesEnum[suffix]) {
            return numberPart * suffixes_enum_1.SuffixesEnum[suffix];
        }
    }
    return null;
};
class CharacterService {
    getAndSaveCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let characters = [];
            let normalizedCharacters = [];
            let totalPages = 1;
            while (page <= totalPages) {
                const response = yield axios_1.default.get(`${index_1.default.FETCH_URI}?page=${page}`);
                if (!response.data || !response.data.meta) {
                    throw new Error('Invalid API response');
                }
                if (page === 1) {
                    totalPages = response.data.meta.totalPages;
                }
                const pageCharacters = response.data.items.map((character) => ({
                    character_number: character.id,
                    name: character.name,
                    ki: character.ki,
                    maxKi: character.maxKi,
                    race: character.race,
                    gender: character.gender,
                    description: character.description,
                    image: character.image,
                }));
                characters = [...characters, ...pageCharacters];
                normalizedCharacters = characters.map((character) => ({
                    character_number: character.character_number,
                    name: character.name,
                    ki: parseKi(character.ki),
                    maxKi: parseKi(character.maxKi),
                    race: character.race,
                    gender: character.gender,
                    description: character.description,
                    image: character.image,
                }));
                page++;
            }
            for (const character of normalizedCharacters) {
                yield character_schema_1.default.updateOne({ character_number: character.character_number }, { $set: character }, { upsert: true });
            }
            return { message: 'Data obtained and saved successfully' };
        });
    }
    getCharacters(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = (0, pagination_utils_1.pagination)(queryParams);
            const query = Object.assign(Object.assign(Object.assign({}, (queryParams.search && {
                $or: [
                    { name: { $regex: queryParams.search, $options: 'i' } },
                    { description: { $regex: queryParams.search, $options: 'i' } },
                ],
            })), (queryParams.race && { race: queryParams.race })), (queryParams.gender && { gender: queryParams.gender }));
            if (queryParams.ki_min || queryParams.ki_max) {
                query.ki = Object.assign({}, queryParams.ki_min && { $gte: queryParams.ki_min }, queryParams.ki_max && { $lte: queryParams.ki_max });
            }
            const characters = yield character_schema_1.default.paginate(query, options);
            return {
                data: characters.docs,
                paginate: {
                    page: options.page,
                    pageSize: options.limit,
                    total: characters.totalDocs,
                },
            };
        });
    }
    getCharacterById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield character_schema_1.default.findById(id);
            if (!affiliate)
                throw new errors_1.NotFoundError(messages_enum_1.ErrorMessage.CharacterNotFound);
            return affiliate;
        });
    }
    createCharacter(character) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCharacter = yield character_schema_1.default.findOne({
                name: character.name,
            });
            if (existingCharacter)
                throw new errors_1.BadRequestError(messages_enum_1.ErrorMessage.CharacterAlreadyExists);
            const lastCharacter = yield character_schema_1.default.findOne()
                .sort({ id: -1 })
                .limit(1);
            character.character_number = lastCharacter
                ? lastCharacter.character_number + 1
                : 1;
            return yield character_schema_1.default.create(character);
        });
    }
    updateCharacter(id, character) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCharacter = yield character_schema_1.default.findOneAndUpdate({ _id: id }, character, { new: true });
            if (!updatedCharacter)
                throw new errors_1.NotFoundError(messages_enum_1.ErrorMessage.CharacterNotFound);
            return updatedCharacter;
        });
    }
    deleteCharacter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCharacter = yield character_schema_1.default.findOneAndDelete({ _id: id });
            if (!deletedCharacter)
                throw new errors_1.NotFoundError(messages_enum_1.ErrorMessage.CharacterNotFound);
            return { message: 'Character deleted successfully' };
        });
    }
}
exports.default = new CharacterService();
