"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const errors_1 = require("../config/errors");
const messages_enum_1 = require("../config/errors/messages.enum");
const validateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Not token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, index_1.default.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        const authError = new errors_1.UnauthorizedError(messages_enum_1.ErrorMessage.InvalidToken);
        next(authError);
    }
};
exports.default = validateToken;
