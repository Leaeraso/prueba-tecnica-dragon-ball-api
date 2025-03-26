"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../config/errors");
const errorMiddleware = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err instanceof errors_1.BaseError) {
        res.status(err.statusCode).json({
            error: err.error,
            message: err.message,
            statusCode: err.statusCode,
        });
        return;
    }
    res.status(500).json({
        error: 'Internal server error',
        statusCode: 500,
        message: err.message,
    });
};
exports.default = errorMiddleware;
