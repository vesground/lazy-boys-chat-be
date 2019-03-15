import { expect } from 'chai';
import moment from 'moment';
import { baseUrl } from 'test/config.js';
import { post } from 'test/ApiClient';
import { BadRequestCreator, InternalErrorCreator } from 'lib/Exception';

const route = '/api/v1/users';
const url = `${baseUrl}${route}`

describe(`POST ${url}`, function() {
  const data = {
    name: "ohmime",
    photoUrl: "http://vesground.info/photo/1234"
  };

  context('Without params', function() {
    it('should return validation error cause of missed params', async () => {
      const res = await post(url, {});
      const error = BadRequestCreator({ params: { name: 'REQUIRED' } });

      expect(res.status).to.equal(error.status);
      expect(res.message).to.equal(error.message);
    })
  })

  context('With wrong params type', function() {
    it('should return validation error cause of wrong params format', async () => {
      const wrongData = Object.assign({}, data, { name: 12 });
      const error = BadRequestCreator({ params: { name: 'TOO_SHORT' }});

      const res = await post(url, wrongData);

      expect(res.status).to.equal(error.status);
      expect(res.message).to.equal(error.message);
    })
  })

  context('With params', function() {
    it('should return a successfuly created new user', async () => {
      const res = await post(url, data);
      const timestampNow = moment().format('X');
      const correctResponse = Object.assign(data, { id: 'ObjectId(1)', createdAt: timestampNow, updatedAt: timestampNow });

      expect(res.status).to.equal(200);
      expect(JSON.stringify(res.data)).to.equal(JSON.stringify(data));
    })
  })

  context('With params', function() {
    it('should return an error cause user with the same name already exist', async () => {
      data.name = 'ohmime';
      const res = await post(url, data);
      const error = InternalErrorCreator(`User with name ${data.name} already exist!`);

      expect(res.status).to.equal(error.status);
      expect(res.message).to.equal(error.message);
    })
  })

})
