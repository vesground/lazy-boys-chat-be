import { Validator } from 'livr';
import { BadArgumentsCreator, InternalErrorCreator } from 'lib/Exception';
import { deepCopy } from 'lib/utils';

const DefaultValidator = (function() {
  let defaultRules = {};
  let defaultError = InternalErrorCreator;
  
  const validator = new Validator(defaultRules);

  function validateWithRules(data, rules) {
    if (!data || !rules) throw new BadArgumentsCreator('Data and rules in validateWithRules method cannot be empty!');

    const isValid = validator.validate(data, rules);

    if (isValid) {
      return;
    } else {
      const errors = validator.getErrors();
      throw defaultError(errors);
    }
  };

  function serDefaultError(error) {
    defaultError = error;
  }

  return {
    validateWithRules,
    serDefaultError
  }
})();

const ArgumentsValidatorFactory = defaltRule => (value, isRequired = false) => {
  if (!value) throw new BadArgumentsCreator('Value in ArgumentsValidatorFactory cannot be empty!');

  const ruleKey = Object.keys(defaltRule)[0];
  const isFieldNameDefinedInRule = ruleKey !== 'placeholder';
  const fieldName = isFieldNameDefinedInRule ? ruleKey : Object.keys(value)[0];

  const data = isFieldNameDefinedInRule ? { [fieldName]: value } : value;

  let rule = isFieldNameDefinedInRule ? deepCopy(defaltRule) : { [fieldName]: defaltRule.placeholder };
  rule[fieldName] = isRequired ? ['required', rule[fieldName]] : rule[fieldName];

  DefaultValidator.serDefaultError(BadArgumentsCreator);
  DefaultValidator.validateWithRules(data, rule);
};

export const requireArgument = ArgumentsValidatorFactory({ placeholder: 'required' });
export const validateId = ArgumentsValidatorFactory({ id: 'string' });
export const validateEmail = ArgumentsValidatorFactory({ email: 'email' });
export const validatePhone = ArgumentsValidatorFactory({ phone: 'phone' });
export const validateString = ArgumentsValidatorFactory({ placeholder: 'string' });

export default DefaultValidator;
