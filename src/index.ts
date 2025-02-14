import express from 'express';
import dotenv from 'dotenv';
import config from './config/index';
import MongoConnection from './config/mongoose.config';
import router from './routes/index';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import requestLogger from './middlewares/logging-middleware';

dotenv.config();

const app = express();
const PORT = config.HTTP_PORT!;
const swaggerDoc = yaml.load(
  fs.readFileSync('./src/config/docs/swagger-documentation.yaml', 'utf8')
) as JsonObject;

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

MongoConnection.getConntection();

app.listen(PORT, () => {
  console.log(`Server running on ${config.API_URL}:${PORT}`);
});
