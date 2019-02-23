import userServices from 'lib/api/services/users';
import dialogServices from 'lib/api/services/dialogs';

export default Object.assign(userServices, dialogServices);
