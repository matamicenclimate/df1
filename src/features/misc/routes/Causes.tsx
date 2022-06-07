import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useCauseContext } from '@/context/CauseContext';
import { CauseDetail } from '@/componentes/CauseDetail/CauseDetail';
import { CausePostBody } from '@/lib/api/causes';

const Causes = () => {
  const { causes } = useCauseContext();

  return (
    <MainLayout>
      <h1 className="text-center p-10">Causes</h1>
      <div className="flex justify-center">
        {causes?.map((cause: CausePostBody) => (
          <div key={cause?.title}>
            <CauseDetail
              title={cause?.title}
              imageUrl={cause?.imageUrl}
              description={cause?.description}
              wallet={cause?.wallet}
            />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Causes;
