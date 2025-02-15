"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuffixesEnum = void 0;
var SuffixesEnum;
(function (SuffixesEnum) {
    SuffixesEnum[SuffixesEnum["million"] = 1000000] = "million";
    SuffixesEnum[SuffixesEnum["billion"] = 1000000000] = "billion";
    SuffixesEnum[SuffixesEnum["trillion"] = 1000000000000] = "trillion";
    SuffixesEnum[SuffixesEnum["quadrillion"] = 1000000000000000] = "quadrillion";
    SuffixesEnum[SuffixesEnum["quintillion"] = 1000000000000000000] = "quintillion";
    SuffixesEnum[SuffixesEnum["sextillion"] = 1e+21] = "sextillion";
    SuffixesEnum[SuffixesEnum["septillion"] = 1e+24] = "septillion";
    SuffixesEnum[SuffixesEnum["octillion"] = 1e+27] = "octillion";
    SuffixesEnum[SuffixesEnum["nonillion"] = 1e+30] = "nonillion";
    SuffixesEnum[SuffixesEnum["decillion"] = 1e+33] = "decillion";
    SuffixesEnum[SuffixesEnum["googol"] = 1e+100] = "googol";
    SuffixesEnum[SuffixesEnum["googolplex"] = Infinity] = "googolplex";
})(SuffixesEnum || (exports.SuffixesEnum = SuffixesEnum = {}));
