import { WalletContext } from '@/context/WalletContext';
import { ConnectWallet } from '@/features/misc/routes/ConnectWallet';
import { Wallet } from 'algorand-session-wallet';
import { useContext } from 'react';

export interface RequiredProps {
  account: string;
  wallet: Wallet;
}

type Disjoin<T> = Omit<T, keyof RequiredProps>;

interface Element<T> {
  element: (props: T) => JSX.Element;
}

type Props<T> = Disjoin<T> extends Record<string, never>
  ? Element<T>
  : Element<T> & { props: Disjoin<T> };

function hasProps<T>(value: Record<string, T>): value is Record<'props', T> {
  return Object.hasOwn(value, 'prop');
}

/**
 * Makes mandatory that the wallet context to have a wallet,
 * else will display a page requiring a wallet.
 * The injected element MUST have wallet and account props,
 * as non-nullable parameters, at least. The rest of parameters
 * are injected through the params prop.
 *
 * This component ensures that account is not an empty string, also.
 */
export function RequiresWallet<T extends RequiredProps>({ element, ...props }: Props<T>) {
  const ctx = useContext(WalletContext);
  if (
    ctx?.userWallet?.account == null ||
    ctx.userWallet.account === '' ||
    ctx.userWallet.wallet == null
  ) {
    return <ConnectWallet />;
  }
  const data = { wallet: ctx.userWallet.wallet, account: ctx.userWallet.account };
  const Element = element as (props: Record<string, unknown>) => JSX.Element;
  if (hasProps(props)) {
    return <Element {...{ ...data, ...props }} />;
  }
  return <Element {...data} />;
}
