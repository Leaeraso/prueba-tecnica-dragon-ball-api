import { GenderEnum } from '../enums/gender.enum';
import { RaceEnum } from '../enums/race.enum';

export interface generalSearchDto {
  search: string;
  race: RaceEnum;
  gender: GenderEnum;
  page: number;
  page_size: number;
  sort?: string;
  sort_dir?: string;
  ki_min?: number;
  ki_max?: number;
  max_ki?: number;
}
