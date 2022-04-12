import { MainLayout } from '@/componentes/Layout/MainLayout';

/**
 * A root component that shows a panel with information about the
 * minted user's NFTs, ongoing bids, sales...
 */
export default function MyNftList() {
  return (
    <MainLayout>
      <div className="flex w-full">
        <div className="columns-3">&nbsp;</div>
        <div className="columns-1 flex bg-slate-200">
          <div className="p-6 flex-1 shadow-lg rounded-lg bg-white">
            ADO BADO BADO BASO DOAB BOSFB
          </div>
        </div>
        <div className="columns-4">&nbsp;</div>
        <div className="columns-10">
          <h2>My NFTs</h2>
        </div>
      </div>
    </MainLayout>
  );
}
