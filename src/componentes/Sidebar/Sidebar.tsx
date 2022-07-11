const sidebarOptions = ['Price', 'Cause', 'Artist', 'Auction type', 'SDGs'];

const Sidebar = () => {
  return (
    <div className="w-[330px] h-screen px-9">
      <ul className="font-normal text-climate-light-gray">
        {sidebarOptions.map((option) => (
          <li key={option} className="mt-4 flex justify-between items-center">
            <p>{option}</p>
            <span className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
