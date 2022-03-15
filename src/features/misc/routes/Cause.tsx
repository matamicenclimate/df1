import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { CauseContext, CauseContextType } from '@/context/CauseContext';
import { useContext } from 'react';

export const Cause = () => {
  const causeContext = useContext(CauseContext);
  const { data, isLoading, error } = causeContext as CauseContextType;

  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="">
            <h1 className="text-center text-2xl font-bold">Causes</h1>
            {isLoading ? (
              <Spinner />
            ) : (
              data &&
              data.map((cause) => (
                <div className="flex flex-col m-6" key={cause.id}>
                  <h2>{cause.title}</h2>
                  <div>{cause.description}</div>
                </div>
              ))
            )}
            {error && error instanceof Error && error.message}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
