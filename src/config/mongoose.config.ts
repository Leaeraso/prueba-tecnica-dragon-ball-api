import mongoose, { Mongoose } from 'mongoose';
import config from './index';

class MongoConnection {
  private static instance: MongoConnection;
  private static connection: Mongoose | null;
  private uri: string = config.MONGO_DB_URL!;
  private options: mongoose.ConnectOptions = {
    autoIndex: false,
    family: 4,
  };

  private constructor() {
    this.connect();
  }

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  private async connect() {
    mongoose.connection.on('connected', () => {
      console.log('Connected successfully to the database');
    });

    mongoose.connection.on('error', (err) => {
      console.log('Error connecting to the database', err);
    });

    mongoose.connection.on('disconnect', () => {
      console.log('Disconected to the database, retrying...');
    });

    try {
      MongoConnection.connection = await mongoose.connect(
        this.uri,
        this.options
      );
    } catch (error) {
      console.error(`Error trying to connect to the database: ${error}`);
    }
  }

  public getConntection(): Mongoose | null {
    return MongoConnection.connection;
  }
}

export default MongoConnection.getInstance();
