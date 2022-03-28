import * as WalletAccountProvider from '@common/src/services/WalletAccountProvider';
import { none, option, some } from '@octantis/option';
import { Account } from 'algosdk';

@WalletAccountProvider.declare()
export default class SessionWalletAccountProvider implements WalletAccountProvider.type {
  value: option<Account> = none();

  get account(): Account {
    if (this.value.isDefined()) {
      return this.value.value;
    }
    throw new Error(
      "Can't provide an account if you don't supply one beforehand!\n" +
        'Check out the implementation details for this service: ' +
        SessionWalletAccountProvider.name
    );
  }

  set account(account: Account) {
    this.value = some(account);
  }
}
