import { GeneralSearchDtoWithKiFilters } from '../data/dtos/general-search.dto';
import { SortEnum } from '../data/enums/sort.enum';

export const pagination = (queryParams: GeneralSearchDtoWithKiFilters) => {
  const sortOptions: Record<string, 1 | -1> = {};

  if (queryParams.sort) {
    sortOptions[queryParams.sort] =
      queryParams.sort_dir?.toUpperCase() === 'ASC'
        ? SortEnum.ASC
        : SortEnum.DESC;
  } else if (queryParams.ki_min || queryParams.ki_max) {
    sortOptions['ki'] = SortEnum.ASC;
  } else {
    sortOptions['character_number'] = SortEnum.ASC;
  }

  const options = {
    page: queryParams.page || 1,
    limit: queryParams.page_size || 10,
    sort: sortOptions,
  };

  return { options };
};
