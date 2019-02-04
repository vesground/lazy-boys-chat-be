import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';

const GetDialogService = ServiceFactory.createService('base');

// GetDialogService.defaultValidationRules = {
//   query: { 'nested_object': {
//     name: 'string'
//   }}
// };

GetDialogService.execute = async (req, res) => {
  try {
    const { id } = req.params;
    const dialog = await Dialog.get({ id });

    return res.json({ status: 200, data: dialog, meta: {} });
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetDialogService.run(req, res);
