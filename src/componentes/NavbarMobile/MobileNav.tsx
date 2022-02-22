import { Link } from 'react-router-dom';
import { Button } from '../Elements/Button/Button';
// import { ToggleMode } from '../ToggleMode/ToggleMode';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    open?: boolean;
  }
}

type MobileNavProps = {
  open?: boolean;
  handleClick?: () => void;
};

const MobileNav = ({ open, handleClick }: MobileNavProps) => {
  return (
    <div
      className={`h-full w-4/5 flex flex-col fixed bg-custom-gray top-0 right-0 ease-in-out duration-300
            ${open ? 'translate-x-0' : 'translate-full'}`}
      onClick={handleClick}
    >
      <ul className="text-2xl text-center text-custom-white">
        <li className="p-6">
          <Link to="/explore" onClick={handleClick}>
            Explore
          </Link>
        </li>
        <li className="p-6">
          <Link to="/explore" onClick={handleClick}>
            Mint NFT
          </Link>
        </li>
        <li className="p-6">
          <Link to="/resources" onClick={handleClick}>
            Resources
          </Link>
        </li>
        <li className="p-6">
          <Link to="/" onClick={handleClick}>
            Info
          </Link>
        </li>
        <li className="p-7">
          <Button>Connect Wallet</Button>
        </li>
      </ul>
    </div>
  );
};

export default MobileNav;
