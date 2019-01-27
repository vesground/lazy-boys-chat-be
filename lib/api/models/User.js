import { redisClient, generateRedisKey, scanAsync } from 'lib/redis.js';
// import uuidv4 from 'uuid/v4'
import moment from 'moment';

import logger from 'config/logger';
import Exception from 'lib/api/services/Exception';

const User = (function() {
  async function setUser({ name, details }) {
    const userHashKey = generateRedisKey('users', 'name', name);
    const isUserCreated = await redisClient.hmsetAsync(userHashKey, details);
    const userData = await getUsers({ name });

    return userData;
  };
  
  async function getUsers({ name = '' }) {
    const query = `users:name:${name}*`;
    const userHashKeys = await scanAsync('0', query, new Set());
    const isUserFound = userHashKeys.length > 0;

    if (isUserFound) {
      const users = [];

      for (const userHashKey of userHashKeys) {
        const user = await redisClient.hgetallAsync(userHashKey);
        users.push(user);
      }

      return users;
    } else {
      return false;
    }
  };

  function validate({ rules, data }) {
    console.log('validate here');
  };

  return {
    create: async function({ name, photoUrl }) {
      if (!name || !photoUrl) throw Exception.create('missedParams', { serviceName: 'create user', missedParams:['name', 'photoUrl']});
      const isUserNameExist = !!(await this.get({ name }));

      if (isUserNameExist) throw Exception.create('userExist', name);

      let newUserData = {
        name,
        photoUrl,
        createdAt: moment().format('X'),
        updatedAt: moment().format('X')
      };
      const createdUserData = await setUser({ name, details: newUserData});

      logger.info('A new user was created!');

      return createdUserData;
    },
    get: getUsers,
    update: async function({ name, newUserData = {} }) {
      if (!name || !newUserData) throw Exception.create('missedParams', ['name', 'newUserData']);

      const userData = await this.get({ name });
      const isUserNameExist = !!userData;

      if (!isUserNameExist) throw Exception.create('userNotExist', ['name']);

      const gonnaChangeName = !!newUserData.name;

      if (gonnaChangeName) {
        await this.remove({ name });
        userData.name = newUserData.name;
      }

      userData.photoUrl = newUserData.photoUrl || userData.photoUrl;
      userData.updatedAt = moment().format('X');

      return await setUser({ name: newUserData.name, details: userData });
    },

    remove: async function({ name }) {
      if (!name) throw Exception.create('missedParams', ['name']);

      const userHashKey = generateRedisKey('users', 'name', name);
      const result = await delAsync(userHashKey);

      logger.info('delete user', result);
    }
  }
})();

export default User;
