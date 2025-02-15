"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
    }
}
exports.InternalServerError = InternalServerError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
