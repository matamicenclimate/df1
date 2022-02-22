import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import storage from '@/utils/storage';

const API_URL = process.env.REACT_APP_API_URL ?? '';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = storage.getToken();
  const headers = config.headers as AxiosRequestHeaders;
  if (token) {
    headers.authorization = `${token}`;
  }

  headers.Accept = 'application/json';
  return config;
}

export const httpClient = Axios.create({
  baseURL: API_URL,
});

httpClient.interceptors.request.use(authRequestInterceptor);
