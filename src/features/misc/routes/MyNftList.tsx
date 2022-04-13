import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { RichTable } from '@/componentes/Layout/RichTable';
import { useForm } from 'react-hook-form';

function ProfileColumn({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-1/3 pr-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}

function TransactionFrame({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`basis-2/3 pl-12 ${className ?? ''}`.trim()} {...props}>
      {children}
    </div>
  );
}

/**
 * A root component that shows a panel with information about the
 * minted user's NFTs, ongoing bids, sales...
 */
export default function MyNftList() {
  const { register } = useForm();
  return (
    <MainLayout>
      <div className="flex flex-row w-full">
        <ProfileColumn className="flex">
          <div className="basis-1/2">&nbsp;</div>
          <div className="flex p-4 flex-col items-center basis-1/2 shadow-lg rounded-xl bg-white">
            <h5 className="text-lg font-dinpro font-normal text-climate-black-text">
              Climate View
            </h5>
            <p className="text-sm p-2 font-normal font-dinpro text-climate-gray-light">
              @climateview221
            </p>
            <div className="flex pt-2 justify-evenly">
              <div className=" flex flex-col items-center p-2">
                <p>4.657,10 €</p>
                <p className="font-sanspro text-xs text-climate-gray-artist">Total balance</p>
              </div>
              <div className="flex flex-col items-center p-2">
                <p>31</p>
                <p className="font-sanspro text-xs text-climate-gray-artist">Projects backed</p>
              </div>
            </div>
            <div className="p-3 pt-4 w-full">
              <hr />
            </div>
            <div className="flex justify-center w-full">
              <Button className="m-1 w-full" size="sm">
                Mint NFT
              </Button>
              <Button className="m-1 w-full" size="sm" variant="light">
                Wallet
              </Button>
            </div>
          </div>
        </ProfileColumn>
        <TransactionFrame className="flex">
          <div className="flex flex-col basis-3/4">
            <h2 className="text-4xl font-normal font-dinpro text-climate-black-title">My NFTs</h2>
            <div className="p-3 rounded-3xl bg-white shadow-lg mt-7">
              <Form onSubmit={async () => void 0}>
                <div className="flex justify-between">
                  <Input
                    className="basis-2/4"
                    register={register}
                    name="term"
                    type="search"
                    placeholder="Search"
                  />
                  <Button className="basis-1/3" size="sm" variant="inverted">
                    + Mint new NFT
                  </Button>
                </div>
              </Form>
              <RichTable
                header={{
                  name: 'NFT Name',
                  price: 'Price / Type',
                  cause: 'Cause',
                  status: 'Status',
                }}
              >
                {[
                  {
                    name: 'My named NFT',
                    price: '999$',
                    cause: 'No cause',
                    status: 'unknown',
                  },
                  {
                    name: 'My named NFT',
                    price: '999$',
                    cause: 'No cause',
                    status: 'unknown',
                  },
                  {
                    name: 'My named NFT',
                    price: '999$',
                    cause: 'No cause',
                    status: 'unknown',
                  },
                ]}
              </RichTable>
            </div>
          </div>
          <div className="basis-1/4">&nbsp;</div>
        </TransactionFrame>
      </div>
    </MainLayout>
  );
}
