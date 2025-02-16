"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    handleGetToken(_req, res, next) {
        user_service_1.default.getToken()
            .then((result) => res.json(result))
            .catch((err) => next(err));
    }
}
exports.default = new UserController();
