import ServiceFactory from 'lib/api/services/ServiceFactory';
import User from 'lib/api/models/User';

const GetUsersService = ServiceFactory.createService('base');

GetUsersService.defaultValidationRules = {
  query: { 'nested_object': {
    name: 'string'
  }}
};

GetUsersService.execute = async ({ query }, res) => {
  try {
    const users = await User.getUsersByName({ name: query.name });

    return res.json({ status: 200, data: users, meta: { count: users.length }});
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetUsersService.run(req, res);
