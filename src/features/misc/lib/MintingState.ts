// Base polytopes //
export class Failure {
  failed = true as const;
  constructor(readonly reason: Error) {}
}

export class Success<A> {
  failed = false as const;
  constructor(readonly result: A) {}
}

export type Result<A> = Failure | Success<A>;
