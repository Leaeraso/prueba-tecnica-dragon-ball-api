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
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./index"));
class MongoConnection {
    constructor() {
        this.uri = index_1.default.MONGO_DB_URL;
        this.options = {
            autoIndex: false,
            family: 4,
            connectTimeoutMS: 30000,
        };
        this.connect();
    }
    static getInstance() {
        if (!MongoConnection.instance) {
            MongoConnection.instance = new MongoConnection();
        }
        return MongoConnection.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose_1.default.connection.on('connected', () => {
                console.log('Connected successfully to the database');
            });
            mongoose_1.default.connection.on('error', (err) => {
                console.log('Error connecting to the database', err);
            });
            mongoose_1.default.connection.on('disconnect', () => {
                console.log('Disconected to the database, retrying...');
            });
            try {
                MongoConnection.connection = yield mongoose_1.default.connect(this.uri, this.options);
            }
            catch (error) {
                console.error(`Error trying to connect to the database: ${error}`);
            }
        });
    }
    getConntection() {
        return MongoConnection.connection;
    }
}
exports.default = MongoConnection.getInstance();
