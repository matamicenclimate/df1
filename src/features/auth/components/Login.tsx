import { Dialog } from '@/componentes/Dialog/Dialog';
import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
// import { Input } from '@/componentes/Form/Inputs';
import { MainLayout } from '@/componentes/Layout/MainLayout';
// import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  // const auth = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleLogin = async (data: Record<string, unknown>) => {
    console.log(data);

    // await auth.login({ email: data.email as string });
  };

  return (
    <MainLayout>
      ola k ase
      <Form onSubmit={handleLogin} className="flex flex-col">
        <label htmlFor="email">{t('login.heading')}</label>
        {/* ??? */}
        {/* <Input name="email" type="email" /> */}
        <Button type="submit">hasme login</Button>
      </Form>
      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="jkshjlhfldjk"
        subtitle="jkshjlhfldjk"
        claim="sjlkfñlksdo`fgjdflñkgjñlk sdlkjflksjd sdkfj sdf "
      />
      <Button onClick={() => setIsOpen((old) => !old)}>Toggle</Button>
    </MainLayout>
  );
};
