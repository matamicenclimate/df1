import Hamburger from './Hamburger';
import { Link } from 'react-router-dom';

const NavbarMobile = () => {
  return (
    <div className="flex justify-between fixed top-0 h-14 w-full z-10 bg-custom-blue col-">
      <Link to="/">
        <h1 className="text-3xl text-custom-white p-3">ClimateNFT</h1>
      </Link>
      <Hamburger />
    </div>
  );
};

export default NavbarMobile;
