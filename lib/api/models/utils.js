import { redisClient } from 'lib/redis';
import { InternalErrorCreator } from 'lib/Exception';
import { validateString, requireArgument } from 'lib/Validator';

export const setHash = async (key, data) => {
  validateString({ key }, 'required');
  requireArgument({ data });

  const isHashCreated = await redisClient.hmsetAsync(key, data);

  if (!isHashCreated) throw InternalErrorCreator(`Fialed to set hash ${JSON.stringify(isHashCreated)}`);

  const hashData = await redisClient.hgetallAsync(key);

  return hashData;
}

export const checkHash = async (key) => {
  requireArgument({ key });

  const hashData = await redisClient.hgetallAsync(key);

  return !!hashData;
}
