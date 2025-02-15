"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const requestLogger = (req, _res, next) => {
    logger_utils_1.default.info(`${req.method.toUpperCase()} ${req.url} - ${new Date().toISOString()}`);
    next();
};
exports.default = requestLogger;
