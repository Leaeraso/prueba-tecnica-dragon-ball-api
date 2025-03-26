import dotenv from 'dotenv';
import { NotFoundError } from './errors';
import { ErrorMessagesKeys } from './errors/error-messages';

const envFound = dotenv.config();
if (envFound.error) {
  throw new NotFoundError(ErrorMessagesKeys.ENV_FILE_NOT_FOUND);
}

export default {
  HTTP_PORT: Number(process.env.HTTP_PORT) || 9000,
  API_URL: process.env.API_URL,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  FETCH_URI: process.env.FETCH_URI,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
};
