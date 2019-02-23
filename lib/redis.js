import bluebird from 'bluebird';
import redis from 'redis';

bluebird.promisifyAll(redis);
const redisClient = redis.createClient();
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
      const keys = reply[1];

      keys.forEach((key,i) => returnSet.add(key));

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

async function getUniqueId() {
  const newId = await redisClient.incrAsync('id');

  return `ObjectId(${newId})`;
}

export {
  redisClient,
  generateRedisKey,
  scanAsync,
  zscanAsync,
  getUniqueId
};
