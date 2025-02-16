import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({ error: true, message: message });
};

export default errorMiddleware;
