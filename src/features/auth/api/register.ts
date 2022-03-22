import { httpClient } from '@/lib/httpClient';

export type RegisterCredentialsDTO = {
  email: string;
};

export const registerWithEmailAndPassword = (data: RegisterCredentialsDTO): Promise<unknown> => {
  return httpClient.post('/auth/register', data);
};
