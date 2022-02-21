import { magiclink } from '@/lib/magiclink';

export type LoginCredentialsDTO = {
  email: string;
};

export const loginWithEmailAndPassword = async (data: LoginCredentialsDTO): Promise<any> => {
  const redirectURI = `${window.location.origin}/auth/callback`; // 👈 This will be our callback URI

  return magiclink.auth.loginWithMagicLink({ ...data, redirectURI });

  // return httpClient.post('/auth/login', data);
};
