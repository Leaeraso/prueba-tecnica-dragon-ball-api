import express from 'express';
import UserController from '../controllers/user.controller';

class UserRoute {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get(
      '/users/authentication',
      UserController.handleGetToken.bind(this)
    );
  }
}

export default new UserRoute().router;
