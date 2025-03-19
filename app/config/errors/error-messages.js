"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessages = exports.ErrorMessagesKeys = void 0;
var ErrorMessagesKeys;
(function (ErrorMessagesKeys) {
    ErrorMessagesKeys["CHARACTER_NOT_FOUND"] = "CHARACTER_NOT_FOUND";
    ErrorMessagesKeys["INVALID_API_RESPONSE"] = "INVALID_API_RESPONSE";
    ErrorMessagesKeys["CHARACTER_ALREADY_EXISTS"] = "CHARACTER_ALREADY_EXISTS";
    ErrorMessagesKeys["MISSING_DATA_USER"] = "MISSING_DATA_USER";
    ErrorMessagesKeys["INVALID_TOKEN"] = "INVALID_TOKEN";
    ErrorMessagesKeys["ERROR_SENDING_EMAIL"] = "ERROR_SENDING_EMAIL";
})(ErrorMessagesKeys || (exports.ErrorMessagesKeys = ErrorMessagesKeys = {}));
exports.errorMessages = {
    [ErrorMessagesKeys.CHARACTER_NOT_FOUND]: {
        error: 'Resource not found',
        message: 'Character not found',
        statusCode: 404,
    },
    [ErrorMessagesKeys.INVALID_API_RESPONSE]: {
        error: 'Invalid Request',
        message: 'Invalid API response',
        statusCode: 400,
    },
    [ErrorMessagesKeys.CHARACTER_ALREADY_EXISTS]: {
        error: 'Invalid request',
        message: 'Character already exists',
        statusCode: 400,
    },
    [ErrorMessagesKeys.MISSING_DATA_USER]: {
        error: 'Invalid request',
        message: 'Email and username are required',
        statusCode: 400,
    },
    [ErrorMessagesKeys.INVALID_TOKEN]: {
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        statusCode: 401,
    },
    [ErrorMessagesKeys.ERROR_SENDING_EMAIL]: {
        error: 'Internal server error',
        message: 'Error sending the mail',
        statusCode: 500,
    },
};
