import axiosInstance from '../utils/axiosInstance';
import { PLUGIN_ID } from '../pluginId';

export async function getSettings() {
  const settings = await axiosInstance.get(`/${PLUGIN_ID}/settings`);
  
  return settings.data;
}

export async function setSettings(data) {
  const response = await axiosInstance.post(`/${PLUGIN_ID}/settings`, {
    body: data,
  });

  return response.data;
}
