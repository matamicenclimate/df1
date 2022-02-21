import { initReactQueryAuth } from 'react-query-auth';

import storage from '@/utils/storage';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { LoginCredentialsDTO } from '@/features/auth/api/login';
import { RegisterCredentialsDTO, registerWithEmailAndPassword } from '@/features/auth/api/register';
import { AuthUser, UserResponse } from '@/features/auth/types';
import { magiclink } from './magiclink';
import { getUser } from '@/features/auth/api/getUser';
import { MainLayout } from '@/componentes/Layout/MainLayout';

async function handleUserResponse(data: UserResponse) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser(): Promise<AuthUser | null> {
  const isLoggedIn = await magiclink.user.isLoggedIn();
  console.log({ isLoggedIn });

  if (isLoggedIn) {
    // /* Get the DID for the user */
    // const jwt = await magiclink.user.getIdToken();
    // storage.setToken(jwt);

    /* Get user metadata including email */
    const userMetadata = await getUser();
    return userMetadata;
  }

  return null;
}

async function loginFn(data: LoginCredentialsDTO): Promise<AuthUser> {
  // const response = await loginWithEmailAndPassword(data);
  const redirectURI = `${window.location.origin}/auth/callback`; // 👈 This will be our callback URI

  const jwt = await magiclink.auth.loginWithMagicLink({ ...data, redirectURI });

  storage.setToken(jwt as string);
  console.log({ jwt });

  const userMetadata = await getUser();
  return userMetadata;
}

async function registerFn(data: RegisterCredentialsDTO) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function logoutFn() {
  await magiclink.user.logout();
  window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
  AuthUser | null,
  unknown,
  LoginCredentialsDTO,
  RegisterCredentialsDTO
>(authConfig);
