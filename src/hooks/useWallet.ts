import { none, option, some } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { useEffect, useState } from 'react';

let wallet: option<Wallet> = none();

/**
 * Use this as a cross-component wallet store.
 */
export default function useWallet(): [typeof wallet, typeof setWallet, typeof discardWallet] {
  const [value, setValue] = useState(wallet);
  function setWallet(inputValue: Wallet) {
    if (wallet == null) {
      throw new Error(`Not a valid wallet object! Attempting to use an invalid wallet.`);
    }
    setValue((wallet = some(inputValue)));
  }
  function discardWallet() {
    setValue((wallet = none()));
  }
  useEffect(() => setValue(wallet), [value]);
  return [value, setWallet, discardWallet];
}
