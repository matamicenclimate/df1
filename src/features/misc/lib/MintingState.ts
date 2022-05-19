import { AssetInfo } from '@/lib/nft';

export class NftCreationFailed {
  notDone = true as const;
  constructor(readonly reason: Error) {}
}

export class NftCreationSucceed {
  notDone = false as const;
  constructor(readonly asset: AssetInfo) {}
}

export type NftCreation = NftCreationFailed | NftCreationSucceed;

// Leaf/terminal states //
export abstract class MintResult {}

export class FailedNoReason extends MintResult {}
