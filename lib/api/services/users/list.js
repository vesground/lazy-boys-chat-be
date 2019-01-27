import ServiceBaseFactory from 'lib/api/services/ServiceBaseFactory';
import User from 'lib/api/models/User';

const GetUsersService = ServiceBaseFactory.createServiceBase('base');

GetUsersService.defaultValidationRules = {
  query: { 'nested_object': {
    name: ['string', { length_between: [3, 10] }]
  }}
};

GetUsersService.execute = async ({ query }, res) => {
  try {
    const users = await User.get({ name: query.name });

    res.json({ status: 200, data: users, meta: { count: users.length }});
  } catch(error) {
    res.json(error);
  }
}

export default (req, res) => GetUsersService.run(req, res);
