"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.createRoutes();
    }
    createRoutes() {
        this.router.post('/users/authentication', user_controller_1.default.handleGetToken.bind(this));
    }
}
exports.default = new UserRoute().router;
