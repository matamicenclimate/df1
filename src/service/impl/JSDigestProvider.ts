import * as DigestProvider from '@common/src/services/DigestProvider';
import { sha256 } from 'js-sha256';

@DigestProvider.declare()
export default class JSDigestProvider implements DigestProvider.type {
  digest<T>(payload: T): Uint8Array {
    const hash = sha256.create();
    hash.update(JSON.stringify(payload));
    return new Uint8Array(hash.digest());
  }
}
