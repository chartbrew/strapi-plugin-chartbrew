import axiosInstance from '../utils/axiosInstance';
import { getSettings } from './store';

export async function login() {
  const { host, token } = await getSettings();

  return fetch(`${host}/user/relog`, {
    method: 'POST',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot authenticate');

      return response.json();
    })
    .then((user) => {
      return user;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getStrapiTokens() {
  await axiosInstance.get('/admin/api-tokens');
}
