import { GenderEnum } from '../enums/gender.enum';
import { RaceEnum } from '../enums/race.enum';

export interface CharacterDto {
  object_id?: string;
  character_number: number;
  name: string;
  ki: number | null;
  max_ki: number | null;
  race: RaceEnum;
  gender: GenderEnum;
  description: string;
  image: string;
}
