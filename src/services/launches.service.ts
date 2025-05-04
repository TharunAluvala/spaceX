import api from './api';
import { Launch } from '../types/launch';

export const launchesService = {
  // Get all launches
  getAllLaunches: async (): Promise<Launch[]> => {
    const response = await api.get('/launches');
    return response.data;
  },

  // Get a single launch by ID
  getLaunch: async (id: string): Promise<Launch> => {
    const response = await api.get(`/launches/${id}`);
    return response.data;
  },

  // Get launches by rocket ID (for data enrichment)
  getLaunchesByRocket: async (rocketId: string): Promise<Launch[]> => {
    const allLaunches = await launchesService.getAllLaunches();
    return allLaunches.filter(launch => launch.rocket === rocketId);
  },
};