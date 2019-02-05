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

const membersIndexZSET = generateRedisKey('dialogs', 'members');

const Dialog = (function() {
  async function setDialog({ id, details }) {
    if (!id || !details) throw Exception.create('missedParams', { serviceName: 'SET_DIALOG', missedParams:[ 'id, details' ]});

    const dialogHashKey = generateRedisKey('dialogs', id);
    const isDialogCreated = await redisClient.hmsetAsync(dialogHashKey, details);

    if (!isDialogCreated) throw Exception.create('dialogHashCreatingFail', { serviceName: 'SET_DIALOG' });

    const dialogData = await getDialog({ id });

    return dialogData;
  };

  async function getDialog({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'GET_DIALOG', missedParams:[ 'id' ]});

    const query = `dialogs:${id}*`;
    const dialogData = await redisClient.hgetallAsync(query);
    const isDialogFound = !!dialogData;

    if (!isDialogFound) throw Exception.create('dialogNotExist', { serviceName: 'GET_DIALOG', id });

    return dialogData;
  };

  async function setIndexByMembers({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'SET_INDEX', missedParams:[ 'id' ]});

    const dialogHashKey = generateRedisKey('dialogs', id);
    const dialogData = await getDialog({ id });

    const sortedMembers = sortMembersByIdAscending(dialogData.members);
    const dialogMembersIndex = generateRedisKey(sortedMembers);
    const isIndexAddedInZSET = await redisClient.zaddAsync(membersIndexZSET, dialogMembersIndex, dialogHashKey);

    if (!isIndexAddedInZSET) throw Exception.create('addingMembersIndexInZSETFail', { serviceName: 'SET_INDEX' });

    return isIndexAddedInZSET;
  }

  function sortMembersByIdAscending(members) {
    return members.sort((a, b) => (a - b));
  }

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
        lastMessageId: '',
        createdAt: moment().format('X'),
        updatedAt: moment().format('X')
      };

      newDialogData = await setDialog({ id: newDialogData.id, details: newDialogData });
      const isIndexAdded = await setIndexByMembers({ id: newDialogData.id });

      logger.info('A new dialog was created!', newDialogData);

      return newDialogData;
    },
    get: getDialog,
    getDialogByMembers: async function({ mode = 'strict', members }) {
      if (!members) throw Exception.create('missedParams', { serviceName: 'GET_DIALOGS_BY_MEMBERS', missedParams: [ 'members' ]});

      const sortedMembers = sortMembersByIdAscending(members);
      let query = generateRedisKey(sortedMembers);

      if (mode === 'include') {
        query = `*${quey}*`;
      }

      const dialogHashKeys =  zscanAsync(membersIndexZSET, '0', query);
      const isDialogHashesFound = !!dialogHashKeys;

      if (!isDialogHashesFound) throw Exception.create('dialogNotExist', { serviceName: 'GET_DIALOGS_BY_MEMBERS', mode, query });
      let dialogsData = [];

      for (const dialogHashKey of dialogHashKeys) {
        const dialogData = await getDialog({ id: dialogHashKey.id });
        dialogsData.push(dialogData);
      };

      console.log('Found dialog by member', dialogsData);

      return dialogsData;
    },
    checkDialogMember: async function({ dialogId, memberId }) {
      if (!dialogId || !memberId) throw Exception.create('missedParams', { serviceName: 'CHECK_DIALOG_MEMBER', missedParams: [ 'dialogId', 'memberId' ]});

      const dialogData = await getDialog({ id: dialogId });
      const hasDialogMember = dialogData.members.includes(memberId);

      return hasDialogMember;
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
      const isIndexRemoved = await redisClient.zremAsync(membersIndexZSET, dialogHashKey);

      if (!isIndexRemoved) throw Exception.create('deletingMembersIndexInZSETFail', { serviceName: 'REMOVE_DIALOG' });

      const dialog = getDialog({ id });
      const isDialogHashRemoved = await redisClient.delAsync(dialogHashKey);

      if (!isDialogHashRemoved) throw Exception.create('deletingDialogHashFail', { serviceName: 'REMOVE_DIALOG' });

      logger.info(`Dialog ${id} was removed from db`);

      return dialog;
    }
  }
})();

export default Dialog;
