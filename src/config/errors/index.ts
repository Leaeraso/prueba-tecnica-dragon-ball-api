import { errorMessages, ErrorMessagesKeys } from './error-messages';

export class BaseError extends Error {
  public statusCode: number;
  public error: string;

  constructor(key: ErrorMessagesKeys) {
    const { error, message, statusCode } = errorMessages[key];
    super(message);
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends BaseError {
  constructor(key: ErrorMessagesKeys) {
    super(key);
  }
}

export class BadRequestError extends BaseError {
  constructor(key: ErrorMessagesKeys) {
    super(key);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(key: ErrorMessagesKeys) {
    super(key);
  }
}

export class InternalServerError extends BaseError {
  constructor(key: ErrorMessagesKeys) {
    super(key);
  }
}
