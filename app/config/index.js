"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFound = dotenv_1.default.config();
if (envFound.error) {
    throw new Error(`Couldn't find .env file`);
}
exports.default = {
    HTTP_PORT: Number(process.env.HTTP_PORT) || 9000,
    API_URL: process.env.API_URL,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    FETCH_URI: process.env.FETCH_URI,
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
};
