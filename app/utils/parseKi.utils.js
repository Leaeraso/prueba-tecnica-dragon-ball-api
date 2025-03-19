"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suffixes_enum_1 = require("../data/enums/suffixes.enum");
const parseKi = (ki) => {
    const normalizedKi = ki.toLowerCase().replace(/[,.]/g, '');
    if (!isNaN(Number(normalizedKi))) {
        return Number(normalizedKi);
    }
    const match = normalizedKi.match(/^([\d\.]+)\s*([a-zA-Z]+)$/);
    if (!match) {
        return null;
    }
    const numberPart = parseFloat(match[1]);
    const suffix = match[2];
    if (!suffixes_enum_1.SuffixesEnum[suffix]) {
        return null;
    }
    return numberPart * suffixes_enum_1.SuffixesEnum[suffix];
};
exports.default = parseKi;
