import redis, { createClient } from 'redis';

class RedisConnection {
  client: redis.RedisClientType;

  constructor() {
    this.client = createClient({
      url: 'redis://127.0.0.1:6379',
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Error connecting to Redis: ', error);
    }
  }

  getClient() {
    return this.client;
  }
}

export default new RedisConnection();
