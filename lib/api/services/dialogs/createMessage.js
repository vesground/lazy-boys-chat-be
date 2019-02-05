import ServiceFactory from 'lib/api/services/ServiceFactory';
import Dialog from 'lib/api/models/Dialog';
import Message from 'lib/api/models/Message';

const CreateMessageService = ServiceFactory.createService('base');

CreateMessageService.defaultValidationRules = {
  params: ['required', { 'nested_object': {
    authorId: ['required',  'string'],
    content: ['required',  'string',  { length_between: [1, 250] }]
  }}]
};

CreateMessageService.execute = async (req, res) => {
  try {
    const { dialogId, content, authorId } = req.body.data;

    const isUserExist = !!(await User.get({ id: authorId }));
    const isDialogExist = !!(await Dialog.get({ id: dialogId }));
    const hasDialogMember = await Dialog.checkDialogMember({ dialogId, memberId: authorId });

    // add check of url params in default

    const newMessageData = await Message.create({ dialogId, content, authorId })

    return res.json({ status: 200, data: newMessageData, meta: {}});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => CreateMessageService.run(req, res);
