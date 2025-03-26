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
const validate_helper_1 = __importDefault(require("../helpers/validate.helper"));
const exceljs_1 = __importDefault(require("exceljs"));
const nodemailer_utils_1 = __importDefault(require("../utils/nodemailer.utils"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const error_messages_1 = require("../config/errors/error-messages");
const parse_ki_utils_1 = __importDefault(require("../utils/parse-ki.utils"));
const client = redis_config_1.default.getClient();
class CharacterService {
    fetchCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let characters = [];
            let totalPages = 1;
            while (page <= totalPages) {
                const response = yield axios_1.default.get(`${index_1.default.FETCH_URI}?page=${page}`);
                if (!response.data || !response.data.meta) {
                    throw new errors_1.BadRequestError(error_messages_1.ErrorMessagesKeys.INVALID_API_RESPONSE);
                }
                if (page === 1) {
                    totalPages = response.data.meta.totalPages;
                }
                const pageCharacters = response.data.items.map((character) => ({
                    character_number: character.id,
                    name: character.name,
                    ki: (0, parse_ki_utils_1.default)(character.ki),
                    max_ki: (0, parse_ki_utils_1.default)(character.maxKi),
                    race: character.race,
                    gender: character.gender,
                    description: character.description,
                    image: character.image,
                }));
                characters.push(...pageCharacters);
                page++;
            }
            return characters;
        });
    }
    saveCharactersInBatches(characters) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchSize = 10;
            let usedNumbers = yield this.getCharacterNumbers();
            for (let i = 0; i < characters.length; i += batchSize) {
                const batch = characters.slice(i, i + batchSize);
                const results = yield Promise.allSettled(batch.map((character) => __awaiter(this, void 0, void 0, function* () {
                    const existingCharacter = yield character_schema_1.default.findOne({
                        name: character.name,
                    });
                    if (existingCharacter) {
                        character.character_number = existingCharacter.character_number;
                    }
                    else {
                        while (usedNumbers.has(character.character_number)) {
                            character.character_number++;
                        }
                        usedNumbers.add(character.character_number);
                    }
                    yield character_schema_1.default.updateOne({ name: character.name }, { $set: character }, { upsert: true });
                })));
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`Error saving character ${batch[index].character_number}: ${result.reason} `);
                    }
                });
            }
        });
    }
    getAndSaveCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            const characters = yield this.fetchCharacters();
            if (!characters)
                throw new errors_1.BadRequestError(error_messages_1.ErrorMessagesKeys.ERROR_OBTAINING_CHARACTERS);
            yield this.saveCharactersInBatches(characters);
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
            const cacheKey = `characters:${JSON.stringify(queryParams)}`;
            const reply = yield client.get(cacheKey);
            if (reply)
                return JSON.parse(reply);
            const characters = yield character_schema_1.default.paginate(query, options);
            yield client.setEx(cacheKey, 600, JSON.stringify(characters));
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
            const character = yield character_schema_1.default.findById(id);
            if (!character)
                throw new errors_1.NotFoundError(error_messages_1.ErrorMessagesKeys.CHARACTER_NOT_FOUND);
            return character;
        });
    }
    createCharacter(character) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validate_helper_1.default)(character, character_schema_1.default);
            const existingCharacter = yield character_schema_1.default.findOne({
                name: character.name,
            });
            if (existingCharacter)
                throw new errors_1.BadRequestError(error_messages_1.ErrorMessagesKeys.CHARACTER_ALREADY_EXISTS);
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
                throw new errors_1.NotFoundError(error_messages_1.ErrorMessagesKeys.CHARACTER_NOT_FOUND);
            return updatedCharacter;
        });
    }
    deleteCharacter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCharacter = yield character_schema_1.default.findOneAndDelete({ _id: id });
            if (!deletedCharacter)
                throw new errors_1.NotFoundError(error_messages_1.ErrorMessagesKeys.CHARACTER_NOT_FOUND);
            return { message: 'Character deleted successfully' };
        });
    }
    exportCharactersToExcel(queryParams, email) {
        return __awaiter(this, void 0, void 0, function* () {
            queryParams.page_size = yield character_schema_1.default.countDocuments();
            const characters = yield this.getCharacters(queryParams);
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Characters');
            worksheet.columns = [
                { header: 'id', key: 'id', width: 10 },
                { header: 'name', key: 'name', width: 20 },
                { header: 'ki', key: 'ki', width: 20 },
                { header: 'maxKi', key: 'maxKi', width: 20 },
                { header: 'race', key: 'race', width: 20 },
                { header: 'gender', key: 'gender', width: 20 },
                { header: 'description', key: 'description', width: 20 },
            ];
            characters.data.forEach((character) => {
                worksheet.addRow({
                    id: character.character_number,
                    name: character.name,
                    ki: character.ki,
                    maxKi: character.max_ki,
                    race: character.race,
                    gender: character.gender,
                    description: character.description,
                    image: character.image,
                });
            });
            const buffer = yield workbook.xlsx.writeBuffer();
            yield (0, nodemailer_utils_1.default)(email, buffer);
            return buffer;
        });
    }
    getCharacterNumbers() {
        return __awaiter(this, void 0, void 0, function* () {
            const characters = yield character_schema_1.default.find({}, { character_number: 1, _id: 0 });
            const usedNumbers = new Set(characters.map((c) => c.character_number));
            return usedNumbers;
        });
    }
}
exports.default = new CharacterService();
