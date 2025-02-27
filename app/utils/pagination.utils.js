"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const sort_enum_1 = require("../data/enums/sort.enum");
const pagination = (queryParams) => {
    var _a;
    const sortOptions = {};
    if (queryParams.sort) {
        sortOptions[queryParams.sort] =
            ((_a = queryParams.sort_dir) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'ASC'
                ? sort_enum_1.SortEnum.ASC
                : sort_enum_1.SortEnum.DESC;
    }
    else if (queryParams.ki_min || queryParams.ki_max) {
        sortOptions['ki'] = sort_enum_1.SortEnum.ASC;
    }
    if (Object.keys(sortOptions).length === 0) {
        sortOptions['id'] = sort_enum_1.SortEnum.ASC;
    }
    const options = {
        page: queryParams.page || 1,
        limit: queryParams.page_size || 10,
        sort: sortOptions,
    };
    return { options };
};
exports.pagination = pagination;
