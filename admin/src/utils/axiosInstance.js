/**
 * axios with a custom config.
 */

import axios from 'axios';

let token = localStorage.getItem('jwtToken');
if (token) {
  token = token.replaceAll('"', '');
}

const instance = axios.create({
  baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
});

instance.interceptors.request.use(
  async config => {
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    // whatever you want to do with the error
    if (error.response?.status === 401) {
      // window.location.reload();
    }

    throw error;
  }
);

export default instance;
