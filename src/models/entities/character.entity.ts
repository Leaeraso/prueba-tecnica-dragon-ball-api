import { Document, PaginateModel } from 'mongoose';

export interface Character extends Document {
  id: number;
  name: string;
  ki: number;
  max_ki: number;
  race: string;
  gender: string;
  description: string;
  image: string;
}

export type CharacterModel = PaginateModel<Character>;
