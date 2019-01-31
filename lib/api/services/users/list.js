import ServiceBaseFactory from 'lib/api/services/ServiceBaseFactory';
import User from 'lib/api/models/User';

const GetUsersService = ServiceBaseFactory.createServiceBase('base');

GetUsersService.defaultValidationRules = {
  query: { 'nested_object': {
    name: 'string'
  }}
};

GetUsersService.execute = async ({ query }, res) => {
  try {
    const users = await User.get({ name: query.name });

    return res.json({ status: 200, data: users, meta: { count: users.length }});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetUsersService.run(req, res);
