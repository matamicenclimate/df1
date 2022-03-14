import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import EventEmitter from 'events';
import { useEffect, useState } from 'react';

const events = new EventEmitter();

const wallet = new (class WalletHookManager {
  constructor() {
    if (this.store.wallet == null) {
      this.store.wallet = none();
    }
  }
  get store() {
    return window as any as { wallet: option<Wallet> };
  }
  get(): option<Wallet> {
    return this.store.wallet;
  }
  set(wallet: Wallet): option<Wallet> {
    return (this.store.wallet = some(wallet));
  }
  clear(): option<Wallet> {
    return (this.store.wallet = none());
  }
})();

/**
 * Use this as a cross-component wallet store.
 */
export default function useWallet() {
  const [value, update] = useState(wallet.get());
  useEffect(() => {
    events.on('update', update);
    return () => {
      events.off('update', update);
    };
  }, []);
  useEffect(() => {
    update(wallet.get());
  });
  function setWallet(inputValue: Wallet) {
    if (inputValue == null) {
      throw new Error(`Not a valid wallet object! Attempting to use an invalid wallet.`);
    }
    if (inputValue.accounts.length <= 0) {
      console.warn(
        `Wallet did not contain any account, aborting. (Did you cancel the transaction?)`
      );
      return;
    }
    update(wallet.set(inputValue));
    events.emit('update', wallet.get());
  }
  function discardWallet() {
    update(wallet.clear());
    events.emit('update', wallet.get());
  }
  return [value, setWallet, discardWallet] as const;
}
