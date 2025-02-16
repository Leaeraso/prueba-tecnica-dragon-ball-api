import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  public handleGetToken(_req: Request, res: Response, next: NextFunction) {
    UserService.getToken()
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new UserController();
