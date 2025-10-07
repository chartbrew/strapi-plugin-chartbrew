import { getSettings } from './store';

export async function getUserTeam() {
  const { host, token } = await getSettings();

  return fetch(`${host}/team`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch the template configuration');

      return response.json();
    })
    .then((teams) => {      
      return teams;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getStrapiTemplate(teamId) {
  const { host, token } = await getSettings();

  return fetch(`${host}/team/${teamId}/template/community/strapi`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch the template configuration');

      return response.json();
    })
    .then((template) => {
      return template;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getTeamConnections(teamId) {
  const { host, token } = await getSettings();

  return fetch(`${host}/team/${teamId}/connections`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch the template configuration');

      return response.json();
    })
    .then((connections) => {
      return connections;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
