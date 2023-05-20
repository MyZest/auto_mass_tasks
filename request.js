const axios = require('axios')

const baseURL =  process.env.BASE_URL

const instance = axios.create({
  baseURL
});


instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return { code: 500, msg: 'error', error };
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return { code: 500, msg: 'error', error };
  }
);

module.exports = instance
