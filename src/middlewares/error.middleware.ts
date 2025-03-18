import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../config/errors';

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json({
        error: err.error,
        message: err.message,
        statusCode: err.statusCode,
      });
  }

  return res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
    message: err.message,
  });
};

export default errorMiddleware;
