import * as AVMProgramProvider from '@common/src/services/AVMProgramProvider';

@AVMProgramProvider.declare()
export default class NullAVMProgramProvider implements AVMProgramProvider.type {
  get auctionApprovalProgram(): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }
  get clearStateProgram(): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }
}
