import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';

const RemoveDialogService = ServiceFactory.createService('base');

// GetUsersService.defaultValidationRules = {
//   query: { 'nested_object': {
//     name: 'string'
//   }}
// };

RemoveDialogService.execute = async (req, res) => {
  try {
    const { id } = req.params;
    const dialog = await Dialog.remove({ id });

    return res.json({ status: 200, data: dialog, meta: {} });
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => RemoveDialogService.run(req, res);
