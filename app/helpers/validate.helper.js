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
Object.defineProperty(exports, "__esModule", { value: true });
const validateData = (data, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schemaKeys = Object.keys(model.schema.paths);
        const filteredData = Object.keys(data)
            .filter((key) => schemaKeys.includes(key))
            .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});
        const tempDoc = new model(filteredData);
        yield tempDoc.validate();
        return { success: true, message: 'Data validated successfully' };
    }
    catch (error) {
        return { success: false, message: error.errors };
    }
});
exports.default = validateData;
