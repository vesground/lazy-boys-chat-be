import ServiceBaseFactory from 'lib/api/services/ServiceBaseFactory';
import User from 'lib/api/models/User';

const CreateUserService = ServiceBaseFactory.createServiceBase('base');

CreateUserService.defaultValidationRules = {
  params: { 'nested_object': {
    name: ['required', 'string', { length_between: [3, 10] }],
    photo: 'url'
  }}
};

CreateUserService.execute = async (req, res) => {
  try {
    const { name, photoUrl } = req.body.data;
    const newUserData = await User.create({ name, photoUrl });

    res.json({ status: 200, data: newUserData, meta: {}});
  } catch(error) {
    res.json(error);
  }
}

export default (req, res) => CreateUserService.run(req, res);