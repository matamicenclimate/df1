import { setupClient } from '../algorand';
import auctionApproval from './auction_approval.teal';
import auctionClearState from './auction_clear_state.teal';

async function compile(source: string) {
  const bytecode: string = await setupClient().compile(source).do();
  return new Uint8Array(Buffer.from(bytecode, 'base64'));
}

export async function compileAuctionApproval() {
  return await compile(auctionApproval);
}

export async function compileAuctionClearState() {
  return await compile(auctionClearState);
}
