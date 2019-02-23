import logger from 'config/logger';
import parseError from 'parse-error';



function createReadableStack(stack) {
  const readableStack = stack.split('\n').map(row => {
    return row.replace(/^\s+/, '');
  });

  return readableStack;
};

export function InternalError (error) {
  const isError = error instanceof Error;
  if (!isError) {
    error = new Error(error);
    Error.captureStackTrace(error, InternalError);
  }

  const { name, message, stack } = error;
  
  logger.error(stack);

  return { status: 500, message: `${name} ${message}`, details: createReadableStack(stack) };
};

export function MissedParams (params) {
  if (!params) throw new Error('Missed params while creating error in MISSED_PARAMS');
  const error  = new Error();

  error.name = 'MissedParams';
  error.message = `Next params are missed in request: ${JSON.stringify(params)}`;

  Error.captureStackTrace(error, MissedParams)
  logger.error(error.stack);

  return { status: 400, message: `${error.name}: ${error.message}`, details: createReadableStack(error.stack) };
};

export function BadParams (wrongParams, rightParams = '') {
  if (!wrongParams) throw new Error('Missed params ["wrongParams"] while creating error in BAD_PARAMS');
  const error  = new Error();

  error.name = 'BadParams';
  error.message = `Next params have inappropriate type: ${JSON.stringify(wrongParams)}. It has to have next format: ${JSON.stringify(rightParams)}`;

  Error.captureStackTrace(error, BadParams)
  logger.error(error.stack);

  return { status: 400, message: `${error.name} ${error.message}`, details: createReadableStack(error.stack) };
};



// const Error = ({ status, msg, details }) => {
//   if (!status || !msg) throw 'Bad error format!';
//
//   const error = Object.assign({}, { status, msg, details });
//
//   logger.error(JSON.stringify(error));
//
//   return error;
// }

const Exception = {
  create(type, serviceName, params) {
    return this.errors[type](serviceName, params);
  },

  errors: {
    userExist: (serviceName, params) => {
      const details = {
        description: `User with the same name already exist! See sent name below.`,
        service: serviceName,
        params
      };

      return new Error({ status: 400, msg: 'USER_EXIST', details });
    },
    userNotExist: (serviceName, params) => {
      const details = {
        description: `User with the same doesn't exist! See requested user name below!`,
        service: serviceName,
        params
      };

      return new Error({ status: 400, msg: 'USER_NOT_EXIST', details });
    },
    missedParams: (serviceName, params) => {
      const details = {
        description: `Params in next service are missed. See request name and missed params below`,
        service: serviceName,
        params
      };

      return new Error({ status: 400, msg: 'MISSED_PARAMS', details });
    },
  }
}

export default Exception;
