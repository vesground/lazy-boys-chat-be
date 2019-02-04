import ServiceFactory from 'lib/api/services/ServiceFactory';
import User from 'lib/api/models/User';

const GetUserService = ServiceFactory.createService('base');

// GetUsersService.defaultValidationRules = {
//   query: { 'nested_object': {
//     name: 'string'
//   }}
// };

GetUserService.execute = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.get({ id });

    return res.json({ status: 200, data: user, meta: {} });
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => GetUserService.run(req, res);
