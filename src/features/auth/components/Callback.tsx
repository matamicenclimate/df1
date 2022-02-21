import { magiclink } from '@/lib/magiclink';
import { useEffect } from 'react';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';

export const Callback = () => {
  useEffect(() => {
    const onMount = async () => {
      /* Complete the "authentication callback" */
      await magiclink.auth.loginWithCredential();

      /* Get user metadata including email */
      const userMetadata = await magiclink.user.getMetadata();
      console.log({ userMetadata });
    };
    onMount();
  }, []);

  return (
    <MainLayout>
      <Spinner />
    </MainLayout>
  );
};
