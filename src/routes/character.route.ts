import express from 'express';
import CharacterController from '../controllers/character.controller';

class CharacterRoute {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get(
      '/fetch-characters-data',
      CharacterController.handleFetchCharacters.bind(this)
    );
  }
}

export default new CharacterRoute().router;
