import create from 'lib/api/services/dialogs/create';
import list from 'lib/api/services/dialogs/list';
import get from 'lib/api/services/dialogs/get';
import remove from 'lib/api/services/dialogs/remove';

import createMessage from 'lib/api/services/dialogs/createMessage';
import getMessages from 'lib/api/services/dialogs/getMessages';

const controller = () => console.log('ask for controller');

export default {
  '/dialogs': {
    POST: create,
    GET: list
  },
  '/dialogs/:dialogId': {
    GET: get,
    DELETE: remove
  },
  '/dialogs/:dialogId/messages': {
    POST: createMessage,
    GET: getMessages
  },
  '/dialogs/:dialogId/messages/:messageId': {
    GET: controller,
    DELETE: controller
  }
}
