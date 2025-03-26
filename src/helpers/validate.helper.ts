import { Model, Document } from 'mongoose';

const validateData = async <T extends Document>(
  data: Record<string, any>,
  model: Model<T>
) => {
  try {
    const schemaKeys = Object.keys(model.schema.paths);
    const filteredData = Object.keys(data)
      .filter((key) => schemaKeys.includes(key))
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    const tempDoc = new model(filteredData);

    await tempDoc.validate();

    return { success: true, message: 'Data validated successfully' };
  } catch (error: any) {
    return { success: false, message: error.errors };
  }
};

export default validateData;
