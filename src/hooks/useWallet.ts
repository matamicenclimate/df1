import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import EventEmitter from 'events';
import { useEffect, useState } from 'react';

const events = new EventEmitter();
let wallet: option<Wallet> = none();

/**
 * Use this as a cross-component wallet store.
 */
export default function useWallet() {
  const [value, setValue] = useState(wallet);
  useEffect(() => {
    events.on('update', setValue);
    return () => {
      events.off('update', setValue);
    };
  }, []);
  useEffect(() => {
    setValue(wallet);
  });
  function setWallet(inputValue: Wallet) {
    if (inputValue == null) {
      throw new Error(`Not a valid wallet object! Attempting to use an invalid wallet.`);
    }
    setValue((wallet = some(inputValue)));
    events.emit('update', wallet);
  }
  function discardWallet() {
    setValue((wallet = none()));
    events.emit('update', wallet);
  }
  return [value, setWallet, discardWallet] as const;
}
