"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./config/index"));
const mongoose_config_1 = __importDefault(require("./config/mongoose.config"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = index_1.default.HTTP_PORT;
mongoose_config_1.default.getConntection();
app_1.default.listen(PORT, () => {
    console.log(`Server running on ${index_1.default.API_URL}:${PORT}`);
});
