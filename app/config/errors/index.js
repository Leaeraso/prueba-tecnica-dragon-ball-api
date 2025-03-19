"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.BaseError = void 0;
const error_messages_1 = require("./error-messages");
class BaseError extends Error {
    constructor(key) {
        const { error, message, statusCode } = error_messages_1.errorMessages[key];
        super(message);
        this.error = error;
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.BaseError = BaseError;
class NotFoundError extends BaseError {
    constructor(key) {
        super(key);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends BaseError {
    constructor(key) {
        super(key);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends BaseError {
    constructor(key) {
        super(key);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InternalServerError extends BaseError {
    constructor(key) {
        super(key);
    }
}
exports.InternalServerError = InternalServerError;
