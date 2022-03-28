import * as TransactionSigner from '@common/src/services/TransactionSigner';
import { none, option } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { Transaction } from 'algosdk';

function die(): never {
  throw new Error('Signed transaction result did not contain any element!');
}

@TransactionSigner.declare()
export default class SimpleTransactionSigner implements TransactionSigner.type {
  wallet: option<Wallet> = none();

  async signTransaction(transaction: Transaction): Promise<Uint8Array> {
    if (this.wallet.isDefined()) {
      return ((await this.wallet.value.signTxn([transaction])).at(0) ?? die()).blob;
    }
    throw new Error("Didn't set any wallet!");
  }
}
