import axios from 'axios';

export const API = {
  fetchAll: async (apiUrl) => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  create: async (apiUrl, data) => {
    try {
      const response = await axios.post(apiUrl, data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  update: async (apiUrl, data) => {
    try {
      const response = await axios.put(apiUrl, data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  delete: async (apiUrl) => {
    try {
      await axios.delete(apiUrl);
    } catch (error) {
      throw new Error(error);
    }
  }
};
