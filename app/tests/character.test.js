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
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app_1.default.listen(4000);
    const response = yield (0, supertest_1.default)(app_1.default).get('/users/authentication').send();
    console.log('token: ', response.body);
    token = response.body;
}));
describe('GET /characters', () => {
    test('should respond with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/characters').send();
        expect(response.status).toBe(200);
    }), 10000);
    test('should response with an object containing an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/characters').send();
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('characters');
        expect(Array.isArray(response.body.characters)).toBe(true);
    }), 10000);
});
describe('POST /characters', () => {
    test('should respond with a 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/characters')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.status).toBe(201);
    }), 10000);
    test('should respond with a content-type of application/json', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/characters')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    }), 10000);
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app_1.default.close();
}));
