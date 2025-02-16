import express from 'express';
import router from './routes/index';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import morgan from 'morgan';

const app = express();

const swaggerDoc = yaml.load(
  fs.readFileSync('./src/config/docs/swagger-documentation.yaml', 'utf8')
) as JsonObject;
morgan.token('time', () => new Date().toISOString());

app.use(express.json());
app.use(morgan(':method :url :time'));
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
