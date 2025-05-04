import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
});

export default api;