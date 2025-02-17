import { generalSearchDto } from '../data/dtos/general-search.dto';
import { SortEnum } from '../data/enums/sort.enum';

export const pagination = (queryParams: generalSearchDto) => {
  const sortOptions: Record<string, 1 | -1> = {};

  if (queryParams.sort) {
    sortOptions[queryParams.sort] =
      queryParams.sort_dir === 'ASC' ? SortEnum.ASC : SortEnum.DESC;
  } else if (queryParams.ki_min || queryParams.ki_max) {
    sortOptions['ki'] = SortEnum.ASC;
  }

  if (Object.keys(sortOptions).length === 0) {
    sortOptions['id'] = SortEnum.ASC;
  }

  const options = {
    page: queryParams.page || 1,
    limit: queryParams.page_size || 10,
    sort: sortOptions,
  };

  return { options };
};
