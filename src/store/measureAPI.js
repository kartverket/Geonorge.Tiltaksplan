import { apiUrls } from 'components/config';
import { API } from './API';

export const measureAPI = {
  fetchAll: async () => {
    const apiUrl = apiUrls.measure.getAll;
    return await API.fetch(apiUrl);
  },
  fetchById: async (id) => {
    const apiUrl = apiUrls.measure.get.format(id);
    return await API.fetch(apiUrl);
  },
  create: async (data) => {
    const apiUrl = apiUrls.measure.create;
    return await API.create(apiUrl, data);
  },
  update: async (id, data) => {
    const apiUrl = apiUrls.measure.update.format(id);
    return await API.update(apiUrl, data);
  },
  delete: async (id) => {
    const apiUrl = apiUrls.measure.delete.format(id);
    return await API.delete(apiUrl);
  }
};
