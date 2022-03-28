import * as AlgodConfigProvider from '@common/src/services/AlgodConfigProvider';

@AlgodConfigProvider.declare()
export default class StaticAlgodConfigProvider implements AlgodConfigProvider.type {
  readonly server = 'https://testnet-algorand.api.purestake.io/ps2';
  readonly port = '';
  readonly token = 'uwMK5eEd2i52PCM6FOVGY2rQTA5gy0pr52IOAREF';
}
