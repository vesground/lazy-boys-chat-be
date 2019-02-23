import create from 'lib/api/services/users/create';
import list from 'lib/api/services/users/list';
import get from 'lib/api/services/users/get';
import remove from 'lib/api/services/users/remove';

export default {
  '/users': {
    POST: create,
    GET: list
  },
  '/users/:userId': {
    GET: get,
    DELETE: remove
  }
}
