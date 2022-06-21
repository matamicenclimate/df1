import './JSDigestProvider';
import './SimpleTransactionSigner';
import './NullAVMProgramProvider';
import './SessionWalletAccountProvider';
import './StaticAlgodConfigProvider';
import Container from 'typedi';
import NetworkClient from '@common/src/services/NetworkClient';
import { algorandBlockchainSetup } from '@common/src/blockchain/algorand/algosdk';
import OperationSigner from '@common/src/blockchain/lib/OperationSigner';
import { client } from '@/lib/algorand';
import { UnsignedOperation, SignedOperation } from '@common/src/blockchain/Operation';
import * as TransactionSigner from '@common/src/services/TransactionSigner';
import WalletProvider from '../WalletProvider';
import { BlockchainGatewayProvider } from '@common/src/blockchain';

const API_URL = process.env.REACT_APP_API_URL ?? '';
const API_URL_CAUSES = process.env.REACT_APP_API_URL_CAUSES ?? '';

// Provide custom targets for the network service
Container.set(NetworkClient, new NetworkClient(API_URL, API_URL_CAUSES));

class OpSign implements OperationSigner {
  provider: WalletProvider;
  constructor() {
    this.provider = Container.get(WalletProvider);
  }
  async sign(ops: UnsignedOperation[]): Promise<SignedOperation[]> {
    const chain = Container.get(BlockchainGatewayProvider).require();
    for (const wallet of this.provider.wallet) {
      const out = await wallet.signTxn(ops.map((op) => op.data as any));
      return out.map((op) => new SignedOperation(chain, op.txID, op as any));
    }
    throw new Error(`Wallet was not provided!`);
  }
}

// Provide dependencies for algorand vm
algorandBlockchainSetup(client(), new OpSign());
