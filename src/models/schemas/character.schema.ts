import { Character, CharacterModel } from '../entities/character.entity';
import mongoose, { model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CharacterSchema = new mongoose.Schema<Character>(
  {
    id: Number,
    name: { type: String, unique: true },
    ki: Number,
    max_ki: { type: Number, alias: 'maxKi' },
    race: String,
    gender: String,
    description: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

CharacterSchema.plugin(mongoosePaginate);

const CharacterModel = model<Character, CharacterModel>(
  'Character',
  CharacterSchema,
  'characters'
);

export default CharacterModel;
