import express from 'express';
import TestController from '../controllers/test.controller';
class TestRoute {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/test', TestController.handleTest.bind(this));
  }
}

export default new TestRoute().router;
