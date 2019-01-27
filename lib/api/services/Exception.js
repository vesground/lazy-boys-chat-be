import logger from 'config/logger';

const Error = ({ status, msg, details }) => {
  if (!status || !msg) throw 'Bad error format!';

  const error = Object.assign({}, { status, msg, details });

  logger.error(JSON.stringify(error));

  return error;
}

const Exception = {
  create(name, params) {
    return this.errors[name](params);
  },

  errors: {
    userExist: (params) => {
      const details = {
        description: `User with the same name already exist! See sent name below.`,
        name: params
      };

      return new Error({ status: 400, msg: 'USER_EXIST', details });
    },
    userNotExist: (params) => {
      const details = {
        description: `User with the same doesn't exist! See requested user name below!`,
        username: params
      };

      return new Error({ status: 400, msg: 'USER_NOT_EXIST', details });
    },
    missedParams: (params) => {
      const details = {
        description: `Params in next service are missed. See request name and missed params below`,
        service: params.serviceName,
        missedParams: params.missedParams
      };

      return new Error({ status: 400, msg: 'MISSED_PARAMS', details });
    },
  }
}

export default Exception;
