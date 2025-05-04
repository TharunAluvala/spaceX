import api from './api';
import { Rocket } from '../types/rocket';

export const rocketsService = {
  // Get all rockets
  getAllRockets: async (): Promise<Rocket[]> => {
    const response = await api.get('/rockets');
    return response.data;
  },

  // Get a single rocket by ID
  getRocket: async (id: string): Promise<Rocket> => {
    const response = await api.get(`/rockets/${id}`);
    return response.data;
  },
};