import config from '../config/index';
import axios from 'axios';
import { characterDto } from '../data/dtos/character.dto';
import CharacterModel from '../models/schemas/character.schema';

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
}

export default new CharacterService();
