import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';

const GetDialogsService = ServiceFactory.createService('base');

GetDialogsService.defaultValidationRules = {
  query: { 'nested_object': {
    mode: 'string',
    members: { 'list_of': ['required',  'string'] }
  }}
};

GetDialogsService.execute = async (req, res) => {
  try {
    const { members, mode } = req.query;
    const dialogs = await Dialog.getDialogByMembers({ mode, members });

    return res.json({ status: 200, data: dialogs, meta: { count: dialogs.length }});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetDialogsService.run(req, res);
