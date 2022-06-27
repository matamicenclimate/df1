import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useCauseContext } from '@/context/CauseContext';
import { CauseDetail } from '@/componentes/CauseDetail/CauseDetail';
import { CausePostBody } from '@/lib/api/causes';

const Causes = () => {
  const { causes } = useCauseContext();

  return (
    <MainLayout>
      <div className="py-10 flex justify-center">
        {causes?.map((cause: CausePostBody) => (
          <div className="px-4 w-[400px]" key={cause?.title}>
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
