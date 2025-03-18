export enum ErrorMessagesKeys {
  CHARACTER_NOT_FOUND = 'CHARACTER_NOT_FOUND',
  INVALID_API_RESPONSE = 'INVALID_API_RESPONSE',
  CHARACTER_ALREADY_EXISTS = 'CHARACTER_ALREADY_EXISTS',
}

export const errorMessages = {
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
};
