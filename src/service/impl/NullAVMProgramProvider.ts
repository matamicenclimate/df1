import * as AVMProgramProvider from '@common/src/services/AVMProgramProvider';
import * as AVMDirectListingProgramProvider from '@common/src/services/AVMDirectListingProgramProvider';

console.warn('Registering AVMProgram Provider');

@AVMProgramProvider.declare()
@AVMDirectListingProgramProvider.declare()
export default class NullAVMProgramProvider implements AVMProgramProvider.type {
  get auctionApprovalProgram(): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }
  get clearStateProgram(): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }
}
