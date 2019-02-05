import moment from 'moment';

import {
  redisClient,
  generateRedisKey,
  getUniqueId,
  scanAsync,
  zscanAsync,
} from 'lib/redis.js';

import logger from 'config/logger';
import Exception from 'lib/api/services/Exception';

const usernameIndexZSET = generateRedisKey('users', 'name');

const User = (function() {
  async function setUser({ id, details }) {
    if (!id || !details) throw Exception.create('missedParams', { serviceName: 'SET_USER', missedParams:[ 'id, details' ]});

    const userHashKey = generateRedisKey('users', id);
    const isUserCreated = await redisClient.hmsetAsync(userHashKey, details);

    if (!isUserCreated) throw Exception.create('setFailed', 'Create user failed');

    const userData = await getUser({ id });

    return userData;
  };

  async function getUser({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'GET_USER', missedParams:[ 'id' ]});

    const userHashKey = generateRedisKey('users', id);
    const userData = await redisClient.hgetallAsync(userHashKey);
    const isUserFound = !!userData;

    if (!isUserFound) throw Exception.create('userNotExist', { serviceName: 'GET_USER', id });

    return userData;
  };

  async function setIndexByName({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'SET_INDEX', missedParams:[ 'id' ]});

    const userHashKey = generateRedisKey('users', id);
    const usernameIndex = generateRedisKey(userNamesZSETKey, details.name);
    const isIndexAddedInZSET = await redisClient.zaddAsync(usernameIndexZSET, usernameIndex, userHashKey);

    if (!isIndexAddedInZSET) throw Exception.create('addingMembersIndexInZSETFail', { serviceName: 'SET_INDEX' });

    return isIndexAddedInZSET;
  }

  // function validate({ rules, data }) {
  //   console.log('validate here');
  // };

  return {
    create: async function({ name, photoUrl = '' }) {
      if (!name) throw Exception.create('missedParams', { serviceName: 'create user', missedParams:['name']});
      const isUserNameExist = !!(await this.get({ name }));

      if (isUserNameExist) throw Exception.create('userExist', name);

      let userData = {
        name,
        photoUrl,
        id: getUniqueId(),
        createdAt: moment().format('X'),
        updatedAt: moment().format('X')
      };
      
      userData = await setUser({ name, details: newUserData});
      const isIndexAdded = await setIndexByName({ id: userData.id });

      logger.info('A new user was created!', userData);

      return userData;
    },
    get: getUser,
    getUsersByName: async function({ name }) {
      if (!name) throw Exception.create('missedParams', { serviceName: 'GET_USERS_BY_NAME', missedParams:[ 'name' ]});

      const query = `users:name:${name}*`;
      const userHashKeys =  zscanAsync(usernameIndexZSET, '0', query);
      const isUserHashFound = userHashKeys && userHashKeys.lenght > 0;

      if (!isUserHashFound) throw Exception.create('userNotExist', { serviceName: 'GET_USERS_BY_NAME' });
      let usersData = [];

      for (const userHashKey of userHashKeys) {
        const userData = await getUser({ id: userHashKey.id });
        usersData.push(userData);
      };

      console.log('Found users by name', users);

      return usersData;
    },
    // update: async function({ name, newUserData = {} }) {
    //   if (!name || !newUserData) throw Exception.create('missedParams', ['name', 'newUserData']);
    //
    //   const userData = await this.get({ name });
    //   const isUserNameExist = !!userData;
    //
    //   if (!isUserNameExist) throw Exception.create('userNotExist', ['name']);
    //
    //   const gonnaChangeName = !!newUserData.name;
    //
    //   if (gonnaChangeName) {
    //     await this.remove({ name });
    //     userData.name = newUserData.name;
    //   }
    //
    //   userData.photoUrl = newUserData.photoUrl || userData.photoUrl;
    //   userData.updatedAt = moment().format('X');
    //
    //   return await setUser({ name: newUserData.name, details: userData });
    // },
    remove: async function({ id }) {
      if (!id) throw Exception.create('missedParams', [ 'id' ]);

      const userHashKey = generateRedisKey('users', id);
      const isIndexRemoved = await redisClient.zremAsync(usernameIndexZSET, dialogHashKey);

      if (!isIndexRemoved) throw Exception.create('deletingUsernameIndexInZSETFail', { serviceName: 'REMOVE_USER' });

      const user = getUser({ id });
      const isUserHashRemoved = await redisClient.hdelAsync(userHashKey);

      if (!isUserHashRemoved) throw Exception.create('deletingUserHashFail', { serviceName: 'REMOVE_USER' });

      logger.info(`User ${id} was removed from db`);

      return user;
    }
  }
})();

export default User;
