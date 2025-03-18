import { GenderEnum } from '../enums/gender.enum';
import { RaceEnum } from '../enums/race.enum';

export interface GeneralSearchDto {
  search: string;
  race: RaceEnum;
  gender: GenderEnum;
  page: number;
  page_size: number;
  sort?: string;
  sort_dir?: string;
  ki_min?: number;
  ki_max?: number;
}
