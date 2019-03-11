import dotenv from 'dotenv';

dotenv.config();

const { HOST, PORT, NODE_ENV, DB } = process.env;

const redisDBs = {
  production: 0,
  development: 1,
  test: 2,
}

export default {
  env: NODE_ENV,
  host: HOST,
  port: PORT,
  redisDB: redisDBs[DB],
}
