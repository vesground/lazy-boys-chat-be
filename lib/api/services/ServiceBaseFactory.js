import { Validator } from 'livr';

const ServiceBaseFactory = {
  createServiceBase(bundle) {
    return Object.create(this.bundle[bundle]);
  },

  bundle: {
    base: {
      defaultValidationRules: {},
      validator: new Validator({}),
      setNewValidationRules: function(newValidationRules) {
        this.validator.livrRules = newValidationRules;
      },
      setValidationRules: function(newValidationRules) {
        let { livrRules } = this.validator;
        livrRules = Object.assign(livrRules, newValidationRules);
      },
      run: function(req, res) {
        const data = {
          params: req.body.data,
          query: req.query
        };
        const { isValid, errors } = this.validateData(data);

        if (!isValid) {
          res.json({ status: 400, msg: 'BAD PARAMS', fields: errors });
        }

        this.execute(req, res);
      },
      validateData: function(data) {
        this.setNewValidationRules(this.defaultValidationRules);
        const isValid = this.validator.validate(data);
        const errors = this.validator.getErrors();

        return { isValid, errors };
      },
      execute: function(req, res) {
        res.json({ status: 200, msg: 'hi, dude' });
      }
    }
  }
};

export default ServiceBaseFactory;
