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

const dialogsMembersZSETKey = generateRedisKey('dialogs', 'members');

const Dialog = (function() {
  async function setDialog({ id, details }) {
    if (!id || !details) throw Exception.create('missedParams', { serviceName: 'SET_DIALOG', missedParams:[ 'id, details' ]});

    const dialogHashKey = generateRedisKey('dialogs', id);
    const orderedMembers = orderMembersByIdsIncreasing(details.members);
    const dialogMembersKey = generateRedisKey(orderedMembers);

    const isDialogCreated = await redisClient.hmsetAsync(dialogHashKey, details);
    const isDialogAddedInZSET = await redisClient.zaddAsync(dialogsMembersZSETKey, dialogMembersKey, dialogHashKey);
    const dialogData = await getDialog({ id });

    return dialogData;
  };

  function orderMembersByIdsIncreasing(members) {
    return members.sort((a, b) => (a - b));
  }

  async function getDialog({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'GET_DIALOG', missedParams:[ 'id' ]});

    const query = `dialogs:${id}*`;
    const dialogData = await redisClient.hgetallAsync(query);
    const isDialogFound = !!dialogData;

    if (!isDialogFound) throw Exception.create('missedParams', { serviceName: 'GET_DIALOG', missedParams:[ 'id' ]});

    return dialogData;
  };

  // function validate({ rules, data }) {
  //   console.log('validate here');
  // };

  return {
    create: async function({ title = 'default', members }) {
      if (!members) throw Exception.create('missedParams', { serviceName: 'CREATE_DIALOG', missedParams:[ 'members' ]});

      const isDialogWithMembersExist = !!(await this.getDialogByMembers({ members }));

      if (isUserNameExist) throw Exception.create('dialogExist', members);

      let newDialogData = {
        id: getUniqueId(),
        title,
        members,
        createdAt: moment().format('X'),
        updatedAt: moment().format('X')
      };
      const newDialogData = await setDialog({ id: newDialogData.id, details: newDialogData});

      logger.info('A new dialog was created!', newDialogData);

      return newDialogData;
    },
    getDialogByMembers: async function({ members }) {
      if (!members) throw Exception.create('missedParams', { serviceName: 'GET_DIALOGS_BY_MEMBER', missedParams:[ 'members' ]});

      const orderedMembers = orderMembersByIdsIncreasing(members);
      const query = generateRedisKey(orderedMembers);
      const dialogHashKey =  zscanAsync(dialogsMembersZSETKey, '0', query);
      const isDialogFound = !!dialogHashKey;

      if (!isDialogFound) return false;

      const dialogData = await redisClient.hgetallAsync(dialogHashKey);

      console.log('found dialog by member', dialogData);

      return dialogData;
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

      const dialogHashKey = generateRedisKey('dialogs', id);
      const isDialogRemovedFromZSET = await redisClient.zremAsync(dialogsMembersZSETKey, dialogHashKey);

      if (!isDialogRemovedFromZSET) throw Exception.create('delFailed', 'Dialog remove from zset failed!');

      const isDialogRemoved = await redisClient.delAsync(dialogHashKey);

      if (!isDialogRemoved) throw Exception.create('delFailed', 'Dialog remove from zset failed!');

      logger.info(`Dialog ${id} was removed from db`);

      return true;
    }
  }
})();

export default Dialog;
