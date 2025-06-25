import axios from "axios";

export const BASE_URL = 'https://doffice.iqnix.tech/';
// export const BASE_URL = 'http://localhost:5000/';
export const API_URL = `${BASE_URL}api`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
  return config;
})

export default $api;