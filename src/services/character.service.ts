import config from '../config/index';
import axios from 'axios';
import { CharacterDto } from '../data/dtos/character.dto';
import CharacterModel from '../models/schemas/character.schema';
import { GeneralSearchDtoWithKiFilters } from '../data/dtos/general-search.dto';
import { pagination } from '../utils/pagination.utils';
import { BadRequestError, NotFoundError } from '../config/errors';
import validateData from '../helpers/validate.helper';
import exceljs from 'exceljs';
import sendExcelByEmail from '../utils/nodemailer.utils';
import RedisConnection from '../config/redis.config';
import { ErrorMessagesKeys } from '../config/errors/error-messages';
import parseKi from '../utils/parseKi.utils';

interface ApiResponse {
  items: any[];
  meta: {
    totalPages: number;
    currentPage: number;
  };
}

const client = RedisConnection.getClient();

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
        max_ki: parseKi(character.maxKi),
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

    console.log('characters length: ', characters.length);

    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize);

      // const nextCharacterNumber = await this.getNextCharacterNumber();

      const results = await Promise.allSettled(
        batch.map((character) =>
          CharacterModel.updateOne(
            { character_number: character.character_number },
            { $set: character },
            { upsert: true }
          )
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `Error saving character ${batch[index].character_number}: ${result.reason} `
          );
        }
      });
    }
  }

  async getAndSaveCharacters() {
    const characters = await this.fetchCharacters();

    if (!characters)
      throw new BadRequestError(ErrorMessagesKeys.ERROR_OBTAINING_CHARACTERS);

    await this.saveCharactersInBatches(characters);

    return { message: 'Data obtained and saved successfully' };
  }

  async getCharacters(queryParams: GeneralSearchDtoWithKiFilters) {
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

    const cacheKey = `characters:${JSON.stringify(queryParams)}`;

    const reply = await client.get(cacheKey);
    if (reply) return JSON.parse(reply);

    const characters = await CharacterModel.paginate(query, options);

    await client.setEx(cacheKey, 600, JSON.stringify(characters));

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

  async exportCharactersToExcel(
    queryParams: GeneralSearchDtoWithKiFilters,
    email: string
  ) {
    const characters = await this.getCharacters(queryParams);
    console.log('characters: ', characters.docs);

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

    characters.docs.forEach((character: CharacterDto) => {
      worksheet.addRow({
        id: character.character_number,
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

  async getNextCharacterNumber() {
    const lastCharacter = await CharacterModel.findOne()
      .sort({ character_number: -1 })
      .limit(1);
    return lastCharacter ? lastCharacter.character_number + 1 : 1;
  }
}

export default new CharacterService();
