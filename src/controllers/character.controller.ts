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

  public handleGetCharacters(req: Request, res: Response, next: NextFunction) {
    CharacterService.getCharacters(req.query as any)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  }

  public handleGetCharacterById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CharacterService.getCharacterById(req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  }

  public handleCreateCharacter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CharacterService.createCharacter(req.body)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => next(err));
  }

  public handleUpdateCharacter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CharacterService.updateCharacter(req.params.id, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  }

  public handleDeleteCharacter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    CharacterService.deleteCharacter(req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  }
}

export default new CharacterController();
