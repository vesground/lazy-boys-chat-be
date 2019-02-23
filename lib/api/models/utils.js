import { redisClient } from 'lib/redis';
import { InternalError, MissedParams } from 'lib/api/services/Exception';

export const setHash = async (key, data = {}) => {
  if (!key) throw new MissedParams('key');

  const isHashCreated = await redisClient.hmsetAsync(key, details);

  if (!isHashCreated) throw new InternalError(`Fialed to set hash ${JSON.stringify(isHashCreated)}`);

  const hashData = await redisClient.hgetallAsync(key);

  return hashData;
}

export const checkHash = async (key) => {
  if (!key) throw new MissedParams('key');

  const hashData = await redisClient.hgetallAsync(key);

  return !!hashData;
}
