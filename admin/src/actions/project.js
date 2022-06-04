import { getSettings } from './store';
import axiosInstance from '../utils/axiosInstance';
import pluginId from '../pluginId';

export async function getProjects() {
  const { host, token } = await getSettings();

  return fetch(`${host}/project/user`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch user projects.');

      return response.json();
    })
    .then((projects) => {
      return projects;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getProjectCharts(projectId) {
  const { host, token } = await getSettings();

  return fetch(`${host}/project/${projectId}/chart`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch project charts.');

      return response.json();
    })
    .then((charts) => {
      return charts;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function createProject(projectId, data) {
  const { host, token } = await getSettings();

  return fetch(`${host}/project/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot create project.');

      return response.json();
    })
    .then((project) => {
      return project;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function createCharts(projectId, data) {
  const { host, token } = await getSettings();

  return fetch(`${host}/project/${projectId}/template/strapi`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Something went wrong when creating the charts');

      return response.json();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getProjectConnections(projectId) {
  const { host, token } = await getSettings();

  return fetch(`${host}/project/${projectId}/connection`, {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Cannot fetch project connections.');

      return response.json();
    })
    .then((connections) => {
      return connections;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function generateTemplate(data) {
  return axiosInstance.post(`/${pluginId}/generate`, data)
    .then((project) => {      
      return project.data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
