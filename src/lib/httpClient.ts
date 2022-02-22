import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import storage from '@/utils/storage';
import Endpoints from './api';

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

type ApiFuture<K extends keyof Endpoints> = Promise<AxiosResponse<Endpoints[K]>>;

type HTTPClient = Omit<AxiosInstance, 'get'> & {
  get<K extends keyof Endpoints>(resource: K, options?: AxiosRequestConfig): ApiFuture<K>;
};

export const httpClient = Axios.create({
  baseURL: API_URL,
}) as HTTPClient;

httpClient.interceptors.request.use(authRequestInterceptor);
