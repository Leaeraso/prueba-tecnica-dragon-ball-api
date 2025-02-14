import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info(
    `${req.method.toUpperCase()} ${req.url} - ${new Date().toISOString()}`
  );
  next();
};

export default requestLogger;
