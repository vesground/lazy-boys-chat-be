import { expect } from 'chai';
import { baseUrl } from 'test/config.js';
import { post } from 'test/ApiClient';
import { BadRequestCreator } from 'lib/Exception';

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
    it('should return a correct response on request', async () => {
      const res = await post(url, data);
      const correctResponse = Object.assign(data, { status: 200 });

      expect(res.status).to.equal(200);
      expect(res.data).to.equal(data.data);
    })
  })

  // context('With params', function() {
  //   it('should return an error cause user with the same name already exist', async () => {
  //     const res = await post(url, data);
  //     const correctResponse = Object.assign(data, { status: 200 });
  //
  //     expect(res.status).to.equal(200);
  //     expect(res.data).to.equal(data.data);
  //   })
  // })

})
