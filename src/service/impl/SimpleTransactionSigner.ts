import * as TransactionSigner from '@common/src/services/TransactionSigner';
import { None, Option } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { Transaction } from 'algosdk';

function die(): never {
  throw new Error('Signed transaction result did not contain any element!');
}

@TransactionSigner.declare()
export default class SimpleTransactionSigner implements TransactionSigner.type {
  wallet: Option<Wallet> = None();

  async signTransaction(transaction: Transaction): Promise<Uint8Array>;
  async signTransaction(transaction: Transaction[]): Promise<Uint8Array[]>;
  async signTransaction(
    transaction: Transaction | Transaction[]
  ): Promise<Uint8Array | Uint8Array[]> {
    if (this.wallet.defined) {
      if (transaction instanceof Array) {
        return (await this.wallet.value.signTxn(transaction)).map((_) => _.blob);
      }
      return ((await this.wallet.value.signTxn([transaction])).at(0) ?? die()).blob;
    }
    throw new Error("Didn't set any wallet!");
  }
}
