import queryString from 'query-string';
import fetch from 'node-fetch';

export const post = async (url, params) => {
  const data = { data: params };
  const result  = await request({ url, method: 'POST', data });

  return result;
}

export const get = async (url, params) => {
  const query = params ? `?${queryString.stringify(params)}` : '';
  const data  = await request({ url, method: 'GET', query });

  return data;
}

async function request({ url, method, query, data }) {
  const res = await fetch(
      `${url}${query ? query : ''}`,
      {
          method,
          headers: {'Content-Type': 'application/json'},
          body : method !== 'GET' ? JSON.stringify(data) : undefined
      }
  );

  const result = await res.json();

  // console.log('request method', result);

  return result;
}
