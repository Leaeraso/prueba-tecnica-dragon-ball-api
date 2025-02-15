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
    this.router.get(
      '/characters',
      CharacterController.handleGetCharacters.bind(this)
    );
    this.router.get(
      '/characters/:id',
      CharacterController.handleGetCharacterById.bind(this)
    );
    this.router.post(
      '/characters',
      CharacterController.handleCreateCharacter.bind(this)
    );
    this.router.put(
      '/characters/:id',
      CharacterController.handleUpdateCharacter.bind(this)
    );
    this.router.delete(
      '/characters/:id',
      CharacterController.handleDeleteCharacter.bind(this)
    );
  }
}

export default new CharacterRoute().router;
