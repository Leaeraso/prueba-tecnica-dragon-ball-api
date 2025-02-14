import { GenderEnum } from '../enums/gender.enum';
import { RaceEnum } from '../enums/race.enum';

export interface characterDto {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: RaceEnum;
  gender: GenderEnum;
  description: string;
  image: string;
}
