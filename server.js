import express from 'express';
import path from 'path';
import redis from 'redis';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import config from 'config/config.json';
import logger from 'config/logger.js'
import routes from 'lib/api/routes';
import { InternalError } from 'lib/api/services/Exception';

const { host, port } = config;
const app = express();

app.use('/statics/', express.static(__dirname + '/config/img'));

app.use(morgan('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function timeLog(req, res, next) {
  console.log(new Date(), `${req.method} ${req.path}`);
  next();
});

app.use('/api/v1', routes);

app.use(function(error, req, res, next) {
  res.json(new InternalError(error));
});

app.listen(port, host);

console.log('Running server at ' + host + ':' + port + '/');
