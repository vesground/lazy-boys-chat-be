import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';

const CreateDialogService = ServiceFactory.createService('base');

CreateDialogService.defaultValidationRules = {
  params: ['required', { 'nested_object': {
    members: { 'list_of': ['required',  'positive_integer', { min_length: 2 }]}
  }}]
};

CreateDialogService.execute = async (req, res) => {
  try {
    const { members } = req.body.data;
    const newUserData = await Dialog.create({ members });

    return res.json({ status: 200, data: newUserData, meta: {}});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => CreateDialogService.run(req, res);
