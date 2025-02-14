import { generalSearchDto } from '../data/dtos/general-search.dto';
import { SortEnum } from '../data/enums/sort.enum';

export const pagination = (queryParams: generalSearchDto) => {
  const sortOptions: Record<string, 1 | -1> = {
    [queryParams.sort || 'name']:
      queryParams.sort_dir?.toUpperCase() == 'ASC'
        ? SortEnum.ASC
        : SortEnum.DESC || SortEnum.ASC,
  };

  const options = {
    page: queryParams.page || 1,
    limit: queryParams.page_size || 10,
    sort: sortOptions,
  };

  return { options };
};
