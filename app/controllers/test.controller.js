"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_service_1 = __importDefault(require("../services/test.service"));
class TestController {
    handleTest(_req, res, next) {
        test_service_1.default.getTest()
            .then((result) => res.json(result))
            .catch((err) => next(err));
    }
}
exports.default = new TestController();
