import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import storage from '@/utils/storage';
import { Endpoints, CausesAPI, CoreAPI } from './api';

const API_URL = process.env.REACT_APP_API_URL ?? '';
const API_URL_CAUSES = process.env.REACT_APP_API_URL_CAUSES ?? '';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = storage.getToken();
  const headers = config.headers as AxiosRequestHeaders;
  if (token) {
    headers.authorization = `${token}`;
  }

  headers.Accept = 'application/json';
  return config;
}

type ApiFuture<A extends Endpoints, V extends keyof A, K extends keyof A[V]> = Promise<
  AxiosResponse<A[V][K]['response']>
>;

type HTTPClient<T extends Endpoints> = Omit<AxiosInstance, 'get' | 'post'> & {
  get<K extends keyof T['get']>(resource: K, options?: AxiosRequestConfig): ApiFuture<T, 'get', K>;
  post<K extends keyof T['post']>(
    resource: K,
    data: T['post'][K]['body'],
    options?: AxiosRequestConfig
  ): ApiFuture<T, 'post', K>;
};

export const httpClient = Axios.create({
  baseURL: 'http://localhost:8000/api/v1', //API_URL,
}) as HTTPClient<CoreAPI>;

export const httpClientCauses = Axios.create({
  baseURL: API_URL_CAUSES,
}) as HTTPClient<CausesAPI>;

export const httpClientMockNfts = Axios.create({
  baseURL: API_URL,
}) as HTTPClient<CoreAPI>;

httpClient.interceptors.request.use(authRequestInterceptor);
