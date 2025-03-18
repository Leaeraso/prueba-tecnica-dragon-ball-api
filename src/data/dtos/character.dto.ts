import { GenderEnum } from '../enums/gender.enum';
import { RaceEnum } from '../enums/race.enum';

export interface CharacterDto {
  object_id?: string;
  character_number: number;
  name: string;
  ki: string;
  maxKi: string;
  race: RaceEnum;
  gender: GenderEnum;
  description: string;
  image: string;
}

export interface NormalizedCharacterDto {
  object_id?: string;
  character_number: number;
  name: string;
  ki: number | null;
  maxKi: number | null;
  race: RaceEnum;
  gender: GenderEnum;
  description: string;
  image: string;
}
