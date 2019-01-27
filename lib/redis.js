import bluebird from 'bluebird';
import redis from 'redis';

bluebird.promisifyAll(redis);
const redisClient = redis.createClient();

function generateRedisKey() {
  return Array.prototype.slice.call(arguments).join(':')
}

function scanAsync(cursor, pattern, returnSet){
    return redisClient.scanAsync(cursor, "MATCH", pattern, "COUNT", "100").then(
      function(reply) {
        cursor = reply[0];
        const keys = reply[1];

        keys.forEach(function(key,i) {
          returnSet.add(key);
        });

        if (cursor === '0') {
          return Array.from(returnSet);
        } else {
          return scanAsync(cursor, pattern, returnSet)
        }
    });
}

export {
  redisClient,
  generateRedisKey,
  scanAsync };
