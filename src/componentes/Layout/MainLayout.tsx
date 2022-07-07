import { Footer } from '@/componentes/Footer/Footer';
import CurrentNFTInfo from '@/features/misc/state/CurrentNFTInfo';
import { option } from '@octantis/option';
import { Navbar } from '../Navbar/Navbar';

type MainLayoutProps = {
  children: React.ReactNode;
  nft?: option<CurrentNFTInfo>;
};

export const MainLayout = ({ children, nft }: MainLayoutProps) => {
  return (
    <div className="mx-auto flex flex-col font-inter">
      <Navbar nft={nft} />
      <div className="pt-12 bg-climate-action-light flex-1 pb-80">{children}</div>
      <Footer />
    </div>
  );
};
