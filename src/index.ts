import dotenv from 'dotenv';
import config from './config/index';
import MongoConnection from './config/mongoose.config';
import RedisConnection from './config/redis.config';

import app from './app';

dotenv.config();

const PORT = config.HTTP_PORT!;

MongoConnection.getConntection();

RedisConnection.connect();

app.listen(PORT, () => {
  console.log(`Server running on ${config.API_URL}:${PORT}`);
});
