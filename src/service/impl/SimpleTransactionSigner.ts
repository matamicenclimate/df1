import * as TransactionSigner from '@common/src/services/TransactionSigner';
import { none, option } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { Transaction } from 'algosdk';

function die(): never {
  throw new Error('Signed transaction result did not contain Record<string, unknown> element!');
}

@TransactionSigner.declare()
export default class SimpleTransactionSigner implements TransactionSigner.type {
  wallet: option<Wallet> = none();

  async signTransaction(transaction: Transaction): Promise<Uint8Array>;
  async signTransaction(transaction: Transaction[]): Promise<Uint8Array[]>;
  async signTransaction(
    transaction: Transaction | Transaction[]
  ): Promise<Uint8Array | Uint8Array[]> {
    if (this.wallet.isDefined()) {
      if (transaction instanceof Array) {
        return (await this.wallet.value.signTxn(transaction)).map((_) => _.blob);
      }
      return ((await this.wallet.value.signTxn([transaction])).at(0) ?? die()).blob;
    }
    throw new Error("Didn't set Record<string, unknown> wallet!");
  }
}
