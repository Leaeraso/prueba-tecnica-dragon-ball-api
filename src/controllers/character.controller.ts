import { Request, Response, NextFunction } from 'express';
import CharacterService from '../services/character.service';

class CharacterController {
  public handleFetchCharacters(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    CharacterService.getAndSaveCharacters()
      .then((result) => res.json(result))
      .catch((err) => next(err));
  }
}

export default new CharacterController();
