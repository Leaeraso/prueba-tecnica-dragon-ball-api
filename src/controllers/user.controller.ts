import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  public handleGetToken(req: Request, res: Response, next: NextFunction) {
    UserService.authenticateUser(req.body)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new UserController();
