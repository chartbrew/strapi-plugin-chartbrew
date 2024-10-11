import axiosInstance from '../utils/axiosInstance';

export async function getModels() {
  const models = await axiosInstance.get('/chartbrew/models');

  return models.data;
}
