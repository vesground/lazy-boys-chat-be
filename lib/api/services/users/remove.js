import ServiceFactory from 'lib/api/services/ServiceFactory';
import User from 'lib/api/models/User';

const RemoveUserService = ServiceFactory.createService('base');

// GetUsersService.defaultValidationRules = {
//   query: { 'nested_object': {
//     name: 'string'
//   }}
// };

RemoveUserService.execute = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ id });

    return res.json({ status: 200, data: user, meta: {} });
  } catch(error) {
    return res.json(error);
  }
}

export default (req, res) => RemoveUserService.run(req, res);
