import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { magiclink } from '@/lib/magiclink';
import storage from '@/utils/storage';
import { useEffect, useState } from 'react';

export const Profile = () => {
  const { user } = useAuth();
  const [toke, setToken] = useState('');
  useEffect(() => {
    const onMount = async () => {
      const jwt = await magiclink.user.getIdToken();
      setToken(jwt);
    };
    onMount();
  }, []);
  return (
    <MainLayout>
      profile
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p className="break-all">{storage.getToken()}</p>
      <p className="break-all">{storage.getMagicToken()}</p>
      <p className="break-all">{toke}</p>
    </MainLayout>
  );
};
