import { expect } from 'chai';
import { baseUrl } from 'test/config.js';
import { post } from 'test/ApiClient';
import { MissedParams, BadParams } from 'lib/api/services/Exception';

const route = '/api/v1/users';
const url = `${baseUrl}${route}`

describe(`POST ${url}`, function() {
  const data = {
    data: {
      name: "ohmime",
      photoUrl: "http://vesground.info/photo/1234"
  }}
  const wrongData = Object.assign(data, { name: 123456 });

  context('Without params', function() {
    it('should return validation error cause of missed params', async () => {
      const res = await post(url, {});

      expect(res).to.equal(new MissedParams('name'));
    })
  })

  context('With wrong params type', function() {
    it('should return validation error cause of wrong params format', async () => {
      const res = await post(url, wrongData);

      expect(res).to.equal(new BadParams({ name: 'number' }, { name: 'string' }));
    })
  })

  context('With params', function() {
    it('should return a correct response on request', async () => {
      const res = await post(url, wrongData);
      const correctResponse = Object.assign(data.data, { status: 200 });

      expect(res).to.equal(correctResponse);
    })
  })

})
