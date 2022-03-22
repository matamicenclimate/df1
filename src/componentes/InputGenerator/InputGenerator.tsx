import { Button } from '@/componentes/Elements/Button/Button';

export type InputGeneratorType<T = unknown> = {
  inputList: {
    trait_type: string;
    value: string;
  }[];
  setInputList: React.Dispatch<React.SetStateAction<InputGeneratorType['inputList']>>;
  value?: T;
  onChange?: (t: T) => void;
};

export const InputGenerator = ({ inputList, setInputList }: InputGeneratorType) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveInput = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInputList([...inputList, { trait_type: '', value: '' }]);
  };

  return (
    <div className="mb-4">
      <label
        className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
        htmlFor="attribute"
      >
        Attributes (Optional)
      </label>
      {inputList.map((x, i) => {
        return (
          <div key={`custom-input-parameter-${i}`} className="flex justify-around">
            <input
              className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="trait_type"
              placeholder="Enter trait type.."
              value={x.trait_type}
              onChange={(e) => handleInputChange(e, i)}
            />
            <input
              className="ml-1 mr-1 shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="value"
              placeholder="Enter value.."
              value={x.value}
              onChange={(e) => handleInputChange(e, i)}
            />
            <div className="btn-box">
              {inputList.length !== 1 && (
                <Button size="sm" variant="delete" onClick={() => handleRemoveInput(i)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <Button size="sm" onClick={handleAddInput}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </div>
  );
};
