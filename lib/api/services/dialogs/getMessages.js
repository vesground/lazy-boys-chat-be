import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';

const GetMessageService = ServiceFactory.createService('base');

GetMessageService.defaultValidationRules = {
  params: ['required', { 'nested_object': {
    dialogId: ['required', 'string']
  }}]
};

GetMessageService.execute = async (req, res) => {
  try {
    const { dialogId } = req.params;
    const messagesData = await Dialog.getMessagesByDialogId({ dialogId });

    return res.json({ status: 200, data: messagesData, meta: { count: messagesData.length} });
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetMessageService.run(req, res);
