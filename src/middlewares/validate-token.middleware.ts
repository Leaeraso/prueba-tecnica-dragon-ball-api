import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import { UnauthorizedError } from '../config/errors';
import { ErrorMessagesKeys } from '../config/errors/error-messages';

interface authRequest extends Request {
  user?: any;
}

const validateToken = (req: authRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) {
    res.status(401).json({ message: 'Not token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY!);
    req.user = decoded;
    next();
  } catch (error: any) {
    const authError = new UnauthorizedError(ErrorMessagesKeys.INVALID_TOKEN);
    next(authError);
  }
};

export default validateToken;
