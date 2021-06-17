import axios from 'axios';


const URL = 'http://127.0.0.1:8000';
const APIKEY = 'default-key';

const getUrl = (path) => `${URL}${path}`;

const getHeader = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
    'x-api-key': APIKEY,
});


export const getRequest = async (path, params, token) => {
  console.log(`${URL}${path}`);
  return axios.get(getUrl(path), {
    params: params,
    headers: getHeader(token)
  });
}

export const postRequest = async (path, data, token) => {
    return axios.post(getUrl(path), data, {
      headers: getHeader(token)
    });
}
