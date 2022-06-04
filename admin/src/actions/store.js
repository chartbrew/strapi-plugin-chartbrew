import axiosInstance from '../utils/axiosInstance';
import pluginId from '../pluginId';

export async function getSettings() {
  const settings = await axiosInstance.get(`/${pluginId}/settings`);
  
  return settings.data;
}

export async function setSettings(data) {
  const response = await axiosInstance.post(`/${pluginId}/settings`, {
    body: data,
  });

  return response.data;
}
