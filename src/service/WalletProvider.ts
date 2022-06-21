import { None, Option } from '@octantis/option';
import { Wallet } from 'algorand-session-wallet';
import { Service } from 'typedi';

@Service()
export default class WalletProvider {
  public wallet: Option<Wallet> = None();
}
