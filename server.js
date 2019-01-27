import express from 'express';
import path from 'path';
import redis from 'redis';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import config from 'config/config.json';
import logger from 'config/logger.js'
import routes from 'lib/api/routes';

const { host, port } = config;
const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', routes);

app.listen(port, host);

console.log('Running server at ' + host + ':' + port + '/');
