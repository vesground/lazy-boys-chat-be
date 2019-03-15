import bluebird from 'bluebird';
import redis from 'redis';

import logger from 'config/logger';
import config from 'config/config.js';

bluebird.promisifyAll(redis);
const redisClient = redis.createClient();
redisClient.select(config.redisDB, () => logger.info(`Selected redis instance: ${process.env.DB}`));
const isTestDb = config.redisDB === 2;

if (isTestDb) {
  redisClient.flushdb(() => {});
}

redisClient.set('id', 0);

function generateRedisKey() {
  return Array.prototype.slice.call(arguments).join(':')
}

function scanAsync(cursor, pattern, returnSet) {
  return redisClient.scanAsync(cursor, "MATCH", pattern, "COUNT", "100")
    .then((reply) => {
      cursor = reply[0];
      const keys = reply[1];

      keys.forEach((key,i) => returnSet.add(key));

      if (cursor === '0') {
        return Array.from(returnSet);
      } else {
        return scanAsync(cursor, pattern, returnSet)
      }
    });
}
function zscanAsync(zsetKey, cursor, pattern = '', returnSet) {
  return redisClient.zscanAsync(zsetKey, cursor, "MATCH", pattern, "COUNT", "100")
    .then((reply) => {
      cursor = reply[0];
      const valuesAndIndexesList = reply[1];

      for (let i = 0; i < valuesAndIndexesList.length; i = i + 2) {
        const value = valuesAndIndexesList[i];
        const index = valuesAndIndexesList[i+1];
        returnSet.add([value, index]);
      };

      if (cursor === '0') {
        return Array.from(returnSet);
      } else {
        return zscanAsync(zsetKey, cursor, pattern = '', returnSet)
      }
    });
}

// function zscanAsync(zsetKey, cursor, pattern){
//     return redisClient.zscanAsync(zsetKey, cursor, "MATCH", pattern, "COUNT", "100").then(
//       function(reply) {
//         cursor = reply[0];
//         const keys = reply[1];
//         const value = keys[0];
//
//         if (cursor === '0') {
//           return value;
//         } else {
//           return zscanAsync(cursor, pattern, returnSet)
//         }
//     });
// }

export {
  redisClient,
  generateRedisKey,
  scanAsync,
  zscanAsync,
};
