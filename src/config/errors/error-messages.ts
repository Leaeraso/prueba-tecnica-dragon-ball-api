export enum ErrorMessagesKeys {
  ENV_FILE_NOT_FOUND = 'ENV_FILE_NOT_FOUND',
  CHARACTER_NOT_FOUND = 'CHARACTER_NOT_FOUND',
  INVALID_API_RESPONSE = 'INVALID_API_RESPONSE',
  CHARACTER_ALREADY_EXISTS = 'CHARACTER_ALREADY_EXISTS',
  MISSING_DATA_USER = 'MISSING_DATA_USER',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ERROR_SENDING_EMAIL = 'ERROR_SENDING_EMAIL',
  ERROR_SAVING_CHARACTERS = 'ERROR_SAVING_CHARACTERS',
  ERROR_OBTAINING_CHARACTERS = 'ERROR_OBTAINING_CHARACTERS',
}

export const errorMessages = {
  [ErrorMessagesKeys.ENV_FILE_NOT_FOUND]: {
    error: 'Resource not found',
    message: 'Could not find .env file',
    statusCode: 404,
  },
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
  [ErrorMessagesKeys.ERROR_SAVING_CHARACTERS]: {
    error: 'Internal server error',
    message: 'Error saving characters',
    statusCode: 500,
  },
  [ErrorMessagesKeys.ERROR_OBTAINING_CHARACTERS]: {
    error: 'Invalid request',
    message: 'Error obtaining characters',
    statusCode: 400,
  },
};
