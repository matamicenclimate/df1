import { useEffect, useState } from 'react';
import algosdk from 'algosdk';
import { Button } from '@/componentes/Elements/Button/Button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@/componentes/Form/Form';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { Wallet } from 'algorand-session-wallet';
import { httpClient } from '@/lib/httpClient';
import { Dialog } from '@/componentes/Dialog/Dialog';
import { createNFT } from '@/lib/nft';
import { MinterProps, NFTMetadataBackend, metadataNFTType, assetInfoType } from '@/lib/type';
import { AlgoWalletConnector } from '@/componentes/Wallet/AlgoWalletConnector';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';

export const Minter = ({ wallet, account }: MinterProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedImage, setSelectedImage] = useState<File>();
  // console.log('selectedImage from minter', selectedImage);
  const [uploadingIPFS, setUploadingToIPFS] = useState(false);
  const [uploadingToBlock, setUploadingToBlock] = useState(false);

  const [dataToPost, setDataToPost] = useState<NFTMetadataBackend | undefined>();
  const [metadataNFT, setMetadataNFT] = useState<metadataNFTType | undefined>();
  const [transaction, setTransaction] = useState<assetInfoType | undefined>();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NFTMetadataBackend>();

  function mintNFT(metadat: metadataNFTType, wallet: Wallet, account: string) {
    const server = 'https://testnet.algoexplorerapi.io';
    const port = 0;
    const token = '';

    const algodClient = new algosdk.Algodv2(token, server, port);
    setUploadingToBlock(true);

    return createNFT(algodClient, account, metadat, wallet).then((result) => {
      setTransaction(result);
      setUploadingToBlock(false);
    });
  }

  const getNFTMetadata = async (data: NFTMetadataBackend) => {
    const filelist: any = data.file;
    const oneFile: File = filelist[0];
    console.log('oneFile', oneFile);
    const dataString = { ...data, file: undefined };

    const form = new FormData();
    form.append('data', JSON.stringify(dataString));
    form.append('file', oneFile, oneFile.name);

    const res = await httpClient.post('ipfs', form);

    console.log('res.data', res.data);
    setMetadataNFT(res.data as metadataNFTType);
    setUploadingToIPFS(false);
  };

  useEffect(() => {
    if (dataToPost) {
      setUploadingToIPFS(true);
      getNFTMetadata(dataToPost);
    }
  }, [dataToPost]);

  useEffect(() => {
    if (metadataNFT && wallet && account) {
      mintNFT(metadataNFT, wallet, account);
    }
  }, [metadataNFT]);

  const checkIfAccount = () => {
    if (account === undefined || account === '') {
      setIsOpen(true);
      return false;
    }
    return true;
  };

  const formSubmitHandler: SubmitHandler<NFTMetadataBackend> = (data: NFTMetadataBackend) => {
    if (checkIfAccount()) {
      setDataToPost(data);
    }
  };

  // if (account === undefined || account === '') {
  //   return (
  //     <Dialog closeButton isOpen={isOpen} setIsOpen={setIsOpen} title="Please connect your wallet">
  //       {/* <AlgoWalletConnector isNavbar /> */}
  //     </Dialog>
  //   );
  // }

  return (
    <div>
      <MainLayout>
        {transaction && (
          <div className="text-center">
            <h2 className="font-bold text-2xl">Your Transaction and Asset</h2>
            <h2 className="font-bold cursor-pointer hover:text-gray-600">
              <a href={`https://testnet.algoexplorer.io/tx/${transaction.transactionId}`}>
                Transaction ID: {transaction.transactionId}
              </a>
            </h2>
            <h2 className="font-bold cursor-pointer hover:text-gray-600">
              Asset ID:{' '}
              <a href={`https://testnet.algoexplorer.io/asset/${transaction.assetID}`}>
                {transaction.assetID}
              </a>
            </h2>
          </div>
        )}
        {uploadingIPFS && (
          <Dialog isOpen={uploadingIPFS} setIsOpen={setIsOpen} title={'Uploading file to IPFS...'}>
            <div className="flex justify-center mt-3">
              <Spinner size="lg" />
            </div>
          </Dialog>
        )}
        {uploadingToBlock && (
          <Dialog
            isOpen={uploadingToBlock}
            setIsOpen={setIsOpen}
            title={'Uploading transaction to Algorand blockchain...'}
          >
            <div className="flex justify-center mt-3">
              <Spinner size="lg" />
            </div>
          </Dialog>
        )}
        <div className="flex justify-center h-screen rounded m-auto">
          <Form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="rounded px-8 pt-6 pb-8 mb-4 md:max-h-[40rem]"
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
              {errors?.file && <span className="text-red-500">This field is required</span>}
            </div>
            <div>
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
              {errors.title && <span className="text-red-500">This field is required</span>}
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
                {...register('author', { required: true })}
              />
              {errors?.author && <span className="text-red-500">This field is required</span>}
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
              {errors.description && <span className="text-red-500">This field is required</span>}
            </div>
            {/* <div>
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
                // value={meta.cause}
                {...register('cause', { required: true })}
              />
              {errors.description && <span className="text-red-500">This field is required</span>}
            </div> */}
            <Button type="submit">Mint Nft</Button>
          </Form>

          {/* {isOpen && !account && ( */}
          {isOpen && (
            <Dialog
              closeButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Please connect your wallet"
            >
              {/* <AlgoWalletConnector isNavbar /> */}
            </Dialog>
          )}
        </div>
      </MainLayout>
    </div>
  );
};
