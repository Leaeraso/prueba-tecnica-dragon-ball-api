import config from '../config/index';
import axios from 'axios';
import { characterDto } from '../data/dtos/character.dto';
import CharacterModel from '../models/schemas/character.schema';
import { generalSearchDto } from '../data/dtos/general-search.dto';
import { pagination } from '../utils/pagination.utils';

interface ApiResponse {
  items: any[];
  meta: {
    totalPages: number;
    currentPage: number;
  };
}

class CharacterService {
  async getAndSaveCharacters() {
    let page = 1;
    let characters: characterDto[] = [];
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await axios.get<ApiResponse>(
        `${config.FETCH_URI!}?page=${page}`
      );

      if (!response.data || !response.data.meta) {
        throw new Error('Invalid API response');
      }

      if (page === 1) {
        totalPages = response.data.meta.totalPages;
      }

      const pageCharacters = response.data.items.map(
        (character: characterDto) => ({
          id: character.id,
          name: character.name,
          ki: character.ki,
          maxKi: character.maxKi,
          race: character.race,
          gender: character.gender,
          description: character.description,
          image: character.image,
        })
      );

      characters = [...characters, ...pageCharacters];
      page++;
    }

    await CharacterModel.insertMany(characters);

    return { message: 'Data obtained and saved successfully' };
  }

  async getCharacters(queryParams: generalSearchDto) {
    const { options } = pagination(queryParams);

    const query: Record<string, any> = {
      ...(queryParams.search && {
        $or: [
          { name: { $regex: queryParams.search, $options: 'i' } },
          { description: { $regex: queryParams.search, $options: 'i' } },
        ],
      }),
      ...(queryParams.race && { race: queryParams.race }),
      ...(queryParams.gender && { gender: queryParams.gender }),
      ...(queryParams.max_ki && { max_ki: queryParams.max_ki }),
    };

    if (queryParams.ki_min || queryParams.ki_max) {
      query.ki = Object.assign(
        {},
        queryParams.ki_min && { $gte: queryParams.ki_min },
        queryParams.ki_max && { $lte: queryParams.ki_max }
      );
    }

    const characters = await CharacterModel.paginate(query, options);

    return {
      data: characters.docs,
      paginate: {
        page: options.page,
        pageSize: options.limit,
        total: characters.totalDocs,
      },
    };
  }
}

export default new CharacterService();
