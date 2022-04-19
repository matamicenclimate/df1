import { httpClient } from '@/lib/httpClient';

/**
 * @deprecated See new client from common.
 */
export function useHttp() {
  return httpClient;
}
