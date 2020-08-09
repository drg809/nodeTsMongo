import * as express from 'express';
import createError from 'http-errors';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';

import { requestLoggerMiddleware } from './middleware/request.logger.middleware';
import * as swaggerUi from 'swagger-ui-express';
import './controllers/users.controller';
import './controllers/summoners.controller';
import './controllers/database.controller';
import './controllers/retries.controller';
import './controllers/usersProfile.controller';

import { RegisterRoutes } from './routes/routes';

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());

app.use(requestLoggerMiddleware);
RegisterRoutes(app);

try {
    const swaggerDocument = require('../swagger.json');
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
    console.log('Unable to load swagger.json', err);
}

app.use(function (req, res, next) {
  next(createError(404));
});

export { app };
