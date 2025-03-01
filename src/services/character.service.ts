import config from '../config/index';
import axios from 'axios';
import {
  characterDto,
  normalizedCharacterDto,
} from '../data/dtos/character.dto';
import CharacterModel from '../models/schemas/character.schema';
import { generalSearchDto } from '../data/dtos/general-search.dto';
import { pagination } from '../utils/pagination.utils';
import { BadRequestError, NotFoundError } from '../config/errors';
import { ErrorMessage } from '../config/errors/messages.enum';
import { SuffixesEnum } from '../data/enums/suffixes.enum';
import validateData from '../helpers/validate.helper';
import exceljs from 'exceljs';
import sendExcelByEmail from '../utils/nodemailer.utils';
import RedisConnection from '../config/redis.config';

interface ApiResponse {
  items: any[];
  meta: {
    totalPages: number;
    currentPage: number;
  };
}

const parseKi = (ki: string): number | null => {
  const normalizedKi = ki.toLowerCase().replace(/[,.]/g, '');

  if (!isNaN(Number(normalizedKi))) {
    return Number(normalizedKi);
  }

  const match = normalizedKi.match(/^([\d\.]+)\s*([a-zA-Z]+)$/);
  if (match) {
    const numberPart = parseFloat(match[1]);
    const suffix = match[2] as keyof typeof SuffixesEnum;

    if (SuffixesEnum[suffix]) {
      return numberPart * SuffixesEnum[suffix];
    }
  }

  return null;
};

const client = RedisConnection.getClient();

class CharacterService {
  async getAndSaveCharacters() {
    let page = 1;
    let characters: characterDto[] = [];
    let normalizedCharacters: normalizedCharacterDto[] = [];
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

      const pageCharacters = response.data.items.map((character) => ({
        character_number: character.id,
        name: character.name,
        ki: character.ki,
        maxKi: character.maxKi,
        race: character.race,
        gender: character.gender,
        description: character.description,
        image: character.image,
      }));

      characters = [...characters, ...pageCharacters];

      normalizedCharacters = characters.map((character) => ({
        character_number: character.character_number,
        name: character.name,
        ki: parseKi(character.ki),
        maxKi: parseKi(character.maxKi),
        race: character.race,
        gender: character.gender,
        description: character.description,
        image: character.image,
      }));
      page++;
    }

    for (const character of normalizedCharacters) {
      await CharacterModel.updateOne(
        { character_number: character.character_number },
        { $set: character },
        { upsert: true }
      );
    }

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
    };

    if (queryParams.ki_min || queryParams.ki_max) {
      query.ki = Object.assign(
        {},
        queryParams.ki_min && { $gte: queryParams.ki_min },
        queryParams.ki_max && { $lte: queryParams.ki_max }
      );
    }

    const reply = await client.get('characters');
    if (reply) return JSON.parse(reply);

    const characters = await CharacterModel.paginate(query, options);

    await client.set('characters', JSON.stringify(characters));

    return {
      data: characters.docs,
      paginate: {
        page: options.page,
        pageSize: options.limit,
        total: characters.totalDocs,
      },
    };
  }

  async getCharacterById(id: characterDto['object_id']) {
    const affiliate = await CharacterModel.findById(id);

    if (!affiliate) throw new NotFoundError(ErrorMessage.CharacterNotFound);

    return affiliate;
  }

  async createCharacter(character: characterDto) {
    await validateData(character, CharacterModel);

    const existingCharacter = await CharacterModel.findOne({
      name: character.name,
    });

    if (existingCharacter)
      throw new BadRequestError(ErrorMessage.CharacterAlreadyExists);

    const lastCharacter = await CharacterModel.findOne()
      .sort({ id: -1 })
      .limit(1);

    character.character_number = lastCharacter
      ? lastCharacter.character_number + 1
      : 1;

    return await CharacterModel.create(character);
  }

  async updateCharacter(
    id: characterDto['object_id'],
    character: Partial<characterDto>
  ) {
    const updatedCharacter = await CharacterModel.findOneAndUpdate(
      { _id: id },
      character,
      { new: true }
    );

    if (!updatedCharacter)
      throw new NotFoundError(ErrorMessage.CharacterNotFound);

    return updatedCharacter;
  }

  async deleteCharacter(id: characterDto['object_id']) {
    const deletedCharacter = await CharacterModel.findOneAndDelete({ _id: id });

    if (!deletedCharacter)
      throw new NotFoundError(ErrorMessage.CharacterNotFound);

    return { message: 'Character deleted successfully' };
  }

  async exportCharactersToExcel(queryParams: generalSearchDto, email: string) {
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

    console.log('email:', email);

    await sendExcelByEmail(email, buffer as Buffer);
    return buffer;
  }
}

export default new CharacterService();
