import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import storage from '@/utils/storage';
import Endpoints from '@/lib/api';

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

type ApiFuture<V extends keyof Endpoints, K extends keyof Endpoints[V]> = Promise<
  AxiosResponse<Endpoints[V][K]['response']>
>;

type HTTPClient = Omit<AxiosInstance, 'get' | 'post'> & {
  get<K extends keyof Endpoints['get']>(
    resource: K,
    options?: AxiosRequestConfig
  ): ApiFuture<'get', K>;
  post<K extends keyof Endpoints['post']>(
    resource: K,
    data: Endpoints['post'][K]['body'],
    options?: AxiosRequestConfig
  ): ApiFuture<'post', K>;
};

export const httpClient = Axios.create({
  baseURL: API_URL,
}) as HTTPClient;

httpClient.interceptors.request.use(authRequestInterceptor);
