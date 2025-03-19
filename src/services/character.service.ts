import config from '../config/index';
import axios from 'axios';
import { CharacterDto } from '../data/dtos/character.dto';
import CharacterModel from '../models/schemas/character.schema';
import { GeneralSearchDto } from '../data/dtos/general-search.dto';
import { pagination } from '../utils/pagination.utils';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../config/errors';
import validateData from '../helpers/validate.helper';
import exceljs from 'exceljs';
import sendExcelByEmail from '../utils/nodemailer.utils';
// import RedisConnection from '../config/redis.config';
import { ErrorMessagesKeys } from '../config/errors/error-messages';
import parseKi from '../utils/parseKi.utils';

interface ApiResponse {
  items: any[];
  meta: {
    totalPages: number;
    currentPage: number;
  };
}

// const client = RedisConnection.getClient();

class CharacterService {
  async fetchCharacters() {
    let page = 1;
    let characters: CharacterDto[] = [];
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await axios.get<ApiResponse>(
        `${config.FETCH_URI!}?page=${page}`
      );

      if (!response.data || !response.data.meta) {
        throw new BadRequestError(ErrorMessagesKeys.INVALID_API_RESPONSE);
      }

      if (page === 1) {
        totalPages = response.data.meta.totalPages;
      }

      const pageCharacters = response.data.items.map((character) => ({
        character_number: character.id,
        name: character.name,
        ki: parseKi(character.ki),
        maxKi: parseKi(character.maxKi),
        race: character.race,
        gender: character.gender,
        description: character.description,
        image: character.image,
      }));

      characters.push(...pageCharacters);

      page++;
    }
    return characters;
  }

  async saveCharactersInBatches(characters: CharacterDto[]) {
    const batchSize = 10;

    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize);

      try {
        Promise.allSettled(
          batch.map((character) => {
            CharacterModel.updateOne(
              { character_number: character.character_number },
              { $set: character },
              { upsert: true }
            );
          })
        );
      } catch (error) {
        console.error(`Error saving characters:`, error);
        throw new InternalServerError(
          ErrorMessagesKeys.ERROR_SAVING_CHARACTERS
        );
      }
    }
  }

  async getAndSaveCharacters() {}

  async getCharacters(queryParams: GeneralSearchDto) {
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
    };

    if (queryParams.ki_min || queryParams.ki_max) {
      query.ki = Object.assign(
        {},
        queryParams.ki_min && { $gte: queryParams.ki_min },
        queryParams.ki_max && { $lte: queryParams.ki_max }
      );
    }

    // const reply = await client.get('characters');
    // if (reply) return JSON.parse(reply);

    const characters = await CharacterModel.paginate(query, options);

    // await client.set('characters', JSON.stringify(characters));

    return {
      data: characters.docs,
      paginate: {
        page: options.page,
        pageSize: options.limit,
        total: characters.totalDocs,
      },
    };
  }

  async getCharacterById(id: CharacterDto['object_id']) {
    const character = await CharacterModel.findById(id);

    if (!character)
      throw new NotFoundError(ErrorMessagesKeys.CHARACTER_NOT_FOUND);

    return character;
  }

  async createCharacter(character: CharacterDto) {
    await validateData(character, CharacterModel);

    const existingCharacter = await CharacterModel.findOne({
      name: character.name,
    });

    if (existingCharacter)
      throw new BadRequestError(ErrorMessagesKeys.CHARACTER_ALREADY_EXISTS);

    const lastCharacter = await CharacterModel.findOne()
      .sort({ id: -1 })
      .limit(1);

    character.character_number = lastCharacter
      ? lastCharacter.character_number + 1
      : 1;

    return await CharacterModel.create(character);
  }

  async updateCharacter(
    id: CharacterDto['object_id'],
    character: Partial<CharacterDto>
  ) {
    const updatedCharacter = await CharacterModel.findOneAndUpdate(
      { _id: id },
      character,
      { new: true }
    );

    if (!updatedCharacter)
      throw new NotFoundError(ErrorMessagesKeys.CHARACTER_NOT_FOUND);

    return updatedCharacter;
  }

  async deleteCharacter(id: CharacterDto['object_id']) {
    const deletedCharacter = await CharacterModel.findOneAndDelete({ _id: id });

    if (!deletedCharacter)
      throw new NotFoundError(ErrorMessagesKeys.CHARACTER_NOT_FOUND);

    return { message: 'Character deleted successfully' };
  }

  async exportCharactersToExcel(queryParams: GeneralSearchDto, email: string) {
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
    };

    if (queryParams.ki_min || queryParams.ki_max) {
      query.ki = Object.assign(
        {},
        queryParams.ki_min && { $gte: queryParams.ki_min },
        queryParams.ki_max && { $lte: queryParams.ki_max }
      );
    }

    const characters = await CharacterModel.find(query)
      .sort(options.sort)
      .select('id name ki max_ki race gender description');

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Characters');

    worksheet.columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'name', key: 'name', width: 20 },
      { header: 'ki', key: 'ki', width: 20 },
      { header: 'maxKi', key: 'maxKi', width: 20 },
      { header: 'race', key: 'race', width: 20 },
      { header: 'gender', key: 'gender', width: 20 },
      { header: 'description', key: 'description', width: 20 },
    ];

    characters.forEach((character) => {
      worksheet.addRow({
        id: character.id,
        name: character.name,
        ki: character.ki,
        maxKi: character.max_ki,
        race: character.race,
        gender: character.gender,
        description: character.description,
        image: character.image,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    await sendExcelByEmail(email, buffer as Buffer);

    return buffer;
  }
}

export default new CharacterService();
