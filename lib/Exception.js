import logger from 'config/logger';
import config from 'config/config';
// import parseError from 'parse-error';



function createReadableStack(stack) {
  const readableStack = stack.split('\n').map(row => {
    return row.replace(/^\s+/, '');
  });

  return readableStack;
};






export const InternalErrorCreator = (error) => {
  const isError = error instanceof Error;
  if (!isError) {
    error = new Error(error);
    Error.captureStackTrace(error, InternalErrorCreator);
  }

  const { name, message, stack } = error;

  if (config.env !== 'test') logger.error(error.stack);

  return { status: 500, message: `${name} ${message}`, details: createReadableStack(stack) };
};

export const BadArgumentsCreator = (args) => {
  if (!args) throw new BadArgumentsError('args');
  const error  = new Error();

  error.name = 'MissedArguments';
  error.message = `Next arguments are missed in the method: ${JSON.stringify(args)}`;

  Error.captureStackTrace(error, BadArgumentsCreator);
  if (config.env !== 'test') logger.error(error.stack);

  return { status: 400, message: `${error.name}: ${error.message}`, details: createReadableStack(error.stack) };
};

export const BadRequestCreator = (errors) => {
  if (!errors) throw new BadArguments('errors');
  const error  = new Error();

  error.name = 'BadRequest';
  error.message = `Data, queries or params are failed in request. Pay attention to validation log: ${JSON.stringify(errors)}.`;

  Error.captureStackTrace(error, BadRequestCreator);
  if (config.env !== 'test') logger.error(error.stack);

  return { status: 400, message: `${error.name} ${error.message}`, details: createReadableStack(error.stack) };
};
