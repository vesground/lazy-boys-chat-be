import ServiceFactory from 'lib/api/services/ServiceFactory';
import User from 'lib/api/models/User';

const CreateUserService = ServiceFactory.createService('base');

CreateUserService.defaultValidationRules = {
  params: ['required', { 'nested_object': {
    name: ['required', 'string', { length_between: [3, 10] }],
    photo: 'url'
  }}]
};

CreateUserService.execute = async (req, res) => {
  try {
    const { name, photoUrl } = req.body.data;
    const newUserData = await User.create({ name, photoUrl });

    return res.json({ status: 200, data: newUserData[0], meta: {}});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => CreateUserService.run(req, res);
