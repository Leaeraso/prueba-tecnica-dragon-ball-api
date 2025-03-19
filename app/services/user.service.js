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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const errors_1 = require("../config/errors");
const error_messages_1 = require("../config/errors/error-messages");
class UserService {
    authenticateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.email || !user.username) {
                throw new errors_1.BadRequestError(error_messages_1.ErrorMessagesKeys.MISSING_DATA_USER);
            }
            const token = jsonwebtoken_1.default.sign({ user }, index_1.default.SECRET_KEY, { expiresIn: '1d' });
            return {
                token: token,
            };
        });
    }
}
exports.default = new UserService();
