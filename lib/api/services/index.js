import createUser from 'lib/api/services/users/create';
import getUsers from 'lib/api/services/users/list.js';
import getUserById from 'lib/api/services/users/get.js';
import deleteUser from 'lib/api/services/users/delete.js';

import createDialog from 'lib/api/services/dialogs/create';
import getDialogs from 'lib/api/services/dialogs/list.js';
import getDialogById from 'lib/api/services/dialogs/get.js';
import deleteDialog from 'lib/api/services/dialogs/delete.js';

export { createUser, getUsers, getUserById, deleteUser, createDialog, getDialogs, getDialogById, deleteDialog };
