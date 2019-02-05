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

const dialogIdIndexZSET = generateRedisKey('dialog', 'id');

const Message = (function() {
  async function setMessage({ id, details }) {
    if (!id || !details) throw Exception.create('missedParams', { serviceName: 'SET_MESSAGE', missedParams:[ 'id, details' ]});

    const messagesgHashKey = generateRedisKey('messages', id);
    const isMessageCreated = await redisClient.hmsetAsync(messagesgHashKey, details);

    if (!isMessageCreated) throw Exception.create('messageHashCreatingFail', { serviceName: 'SET_MESSAGE' });

    const messageData = await getMessage({ id });

    return messageData;
  };

  async function getMessage({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'GET_MESSAGE', missedParams:[ 'id' ]});

    const messageHashKey = generateRedisKey('messages', id);
    const messageData = await redisClient.hgetallAsync(messageHashKey);
    const isMessageFound = !!messageData;

    if (!isMessageFound) throw Exception.create('messageNotExist', { serviceName: 'GET_MESSAGE', id });

    return messageData;
  };

  async function setIndexByDialogHashKey({ id }) {
    if (!id) throw Exception.create('missedParams', { serviceName: 'SET_INDEX', missedParams:[ 'id' ]});

    const messageHashKey = generateRedisKey('messages', id);
    const messageData = await getMessage({ id });
    const dialogHashKey = generateRedisKey('dialogs', messageData.dialogId);

    const isIndexAddedInZSET = await redisClient.zaddAsync(dialogIdIndexZSET, dialogHashKey, messageHashKey);

    if (!isIndexAddedInZSET) throw Exception.create('addingMembersIndexInZSETFail', { serviceName: 'SET_INDEX' });

    return isIndexAddedInZSET;
  }

  // function validate({ rules, data }) {
  //   console.log('validate here');
  // };

  return {
    create: async function({ dialogId, content, authorId }) {
      if (!dialogId || !content || !authorId) throw Exception.create('missedParams', { serviceName: 'CREATE_DIALOG', missedParams:[ 'dialogId, content, authorId' ]});

      let newMessageData = {
        id: getUniqueId(),
        dialogId,
        content,
        authorId,
        createdAt: moment().format('X'),
        updatedAt: moment().format('X')
      };

      newMessageData = await setMessage({ id: newMessageData.id, details: newMessageData});
      const isIndexAdded = await setIndexByDialogHashKey({ id: newMessageData.id });

      logger.info('A new dialog was created!', newMessageData);

      return newMessageData;
    },
    getMessagesByDialogId: async function({ dialogId }) {
      if (!dialogId) throw Exception.create('missedParams', { serviceName: 'GET_MESSAGES_BY_MEMBER', missedParams:[ 'dialogId' ]});

      const query = generateRedisKey('dialogs', dialogId);
      const messageHashKeys =  zscanAsync(dialogIdIndexZSET, '0', query);
      const isMessageHashesFound = messageHashKeys && messageHashKeys.length > 0;

      if (!isMessageHashesFound) throw Exception.create('dialogNotExist', { serviceName: 'GET_MESSAGES_BY_DIALOG_ID', dialogId });
      let messagesData = [];

      for (const messageHashKey of messageHashKeys) {
        const messageData = await getMessage({ id: messageHashKey.id });
        messagesData.push(dialogData);
      };

      console.log('Found messages by dialog id', messagesData);

      return messagesData;
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

      const messageHashKey = generateRedisKey('messages', id);
      const isIndexRemoved = await redisClient.zremAsync(dialogIdIndexZSET, messageHashKey);

      if (!isIndexRemoved) throw Exception.create('deletingMembersIndexInZSETFail', { serviceName: 'REMOVE_DIALOG' });

      const messageData = getMessage({ id });
      const isMessageHashRemoved = await redisClient.delAsync(messageHashKey);

      if (!isMessageHashRemoved) throw Exception.create('deletingDialogHashFail', { serviceName: 'REMOVE_DIALOG' });

      logger.info(`Message ${id} was removed from db`);

      return messageData;
    }
  }
})();

export default Message;
