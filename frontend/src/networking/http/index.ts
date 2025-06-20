import axios from "axios";

export const API_URL = 'http://localhost:5000/api';
// export const API_URL = 'https://doffice.iqnix.tech/api';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
  return config;
})

export default $api;