import { useState } from 'react';
import MobileNav from './MobileNav';

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  return (
    <>
      {open ? (
        <>
          <div
            className="inline after:content-['\00d7'] after:text-4xl text-custom-white bg-custom-blue fixed top-1 right-9"
            open={open}
            onClick={() => setOpen(!open)}
          ></div>
        </>
      ) : (
        <>
          <div
            className="space-y-2 fixed top-3.5 right-9"
            // open={open}
            onClick={() => setOpen(!open)}
          >
            <span className="rounded block w-8 h-0.5 bg-custom-white"></span>
            <span className="rounded block w-8 h-0.5 bg-custom-white"></span>
            <span className="rounded block w-5 h-0.5 bg-custom-white"></span>
          </div>
        </>
      )}
      <div
        className={`right-0 top-14 w-4/5 text-white fixed h-full  ease-in-out duration-300 ${
          open ? 'translate-x-0 ' : 'translate-x-full'
        }`}
      >
        <MobileNav open={open} handleClick={handleClick} />
      </div>
    </>
  );
};

export default Hamburger;
