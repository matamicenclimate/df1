import { DeleteAsset } from '@/componentes/DeleteAsset/DeleteAsset';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Wallet } from 'algorand-session-wallet';

type AdminProps = {
  wallet: Wallet | undefined;
  account: string | undefined;
};

export const Admin = ({ wallet, account }: AdminProps) => {
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="p-4">
          <DeleteAsset account={account} wallet={wallet} />
        </div>
      </div>
    </MainLayout>
  );
};
