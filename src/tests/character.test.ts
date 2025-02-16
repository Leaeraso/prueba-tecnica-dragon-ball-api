import app from '../app';
import request from 'supertest';

let server: any;
let token: string;

beforeAll(async () => {
  server = app.listen(4000);

  const response = await request(app).get('/users/authentication').send();
  console.log('token: ', response.body);
  token = response.body;
});

describe('GET /characters', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/characters').send();
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  server.close();
});
