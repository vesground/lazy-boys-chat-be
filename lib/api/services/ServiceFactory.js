import { Validator } from 'livr';
import { wrapAsync } from 'lib/utils.js';

const ServiceFactory = {
  createService(bundle) {
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
      run: async function(req, res) {
        const isDataPassed = !!req.body.data;
        const isQueryPassed = req.query && Object.keys(req.query).length > 0;
        const data = {};

        if (isQueryPassed) {
          data.query = req.query;
        }

        if (isDataPassed) {
          data.params = req.body.data;
        }

        const { isValid, errors } = this.validateData(data);


        if (!isValid) {
          return res.json({ status: 400, msg: 'BAD PARAMS', fields: errors });
        }

        await this.execute(req, res);
      },
      validateData: function(data) {
        this.setNewValidationRules(this.defaultValidationRules);
        const isValid = this.validator.validate(data);
        const errors = this.validator.getErrors();

        return { isValid, errors };
      },
      execute: function(req, res) {
        return res.json({ status: 200, msg: 'hi, dude' });
      }
    }
  }
};

export default ServiceFactory;
