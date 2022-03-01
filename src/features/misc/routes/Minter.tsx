import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Wallet } from 'algorand-session-wallet';

type NftMintType = {
  file: string;
  title: string;
  artist: string;
  description: string;
  cause: string;
};

export const Minter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NftMintType>();

  const formSubmitHandler: SubmitHandler<NftMintType> = (data: NftMintType) => {
    console.log('data', data);
  };

  return (
    <div>
      <MainLayout>
        <div className="flex justify-center h-screen rounded w-full">
          <Form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4 md:max-h-[36rem] md:shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
                Select File
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-custom-white md:text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                type="file"
                {...register('file', { required: true })}
              />
              {errors.file && <span className="text-red-500">This filed is required</span>}
            </div>
            <div className="mb-6">
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Title.."
                {...register('title', { required: true })}
              />
              {errors.title && <span className="text-red-500">This filed is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="artist"
              >
                Artist
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="artist"
                type="text"
                placeholder="Artist.."
                {...register('artist', { required: true })}
              />
              {errors.artist && <span className="text-red-500">This filed is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Description.."
                {...register('description', { required: true })}
              />
              {errors.description && <span className="text-red-500">This filed is required</span>}
            </div>
            <div>
              <label
                className="block text-custom-white md:text-gray-700 text-sm font-bold mb-2"
                htmlFor="cause"
              >
                Cause
              </label>
              <input
                className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 md:text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="cause"
                placeholder="Cause.."
                {...register('cause', { required: true })}
              />
              {errors.description && <span className="text-red-500">This filed is required</span>}
            </div>
            <Button type="submit">Mint Nft</Button>
          </Form>
        </div>
      </MainLayout>
    </div>
  );
};
