import { Request, Response, NextFunction } from 'express';
import TestService from '../services/test.service';

class TestController {
  public handleTest(_req: Request, res: Response, next: NextFunction) {
    TestService.getTest()
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new TestController();
