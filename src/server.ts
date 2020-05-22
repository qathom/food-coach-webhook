import 'reflect-metadata';

import express from 'express';
import basicAuth from 'express-basic-auth';
import serverless from 'serverless-http';
import { useExpressServer } from 'routing-controllers';
import { WebhookController } from './controllers/WebhookController';
import { CacheController } from './controllers/CacheController';
import { IndexController } from './controllers/IndexController';
import * as path from 'path';

require('dotenv').config();

const app = express();
const port = 3000;

const router = express.Router();

// Render engine
app.set('views', path.join(__dirname, process.env.NODE_ENV === 'production' ? '../..' : '..', '/static/html'))
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'static')));

// Basic authentication
app.use('/hooks', basicAuth({
  users: {
    [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD,
  },
}), router);

useExpressServer(app, {
  controllers: [WebhookController, CacheController, IndexController],
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports.handler = serverless(app);
