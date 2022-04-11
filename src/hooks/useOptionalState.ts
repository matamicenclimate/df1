import { none, option, some } from '@octantis/option';
import React, { useState } from 'react';

function toOption<A>(maybe?: A): option<A> {
  if (maybe == null) {
    return none();
  }
  return some(maybe);
}

/**
 * Sets the state to some given value.
 */
export type SetOptionState<A> = (value: A) => void;

/**
 * Resets the state to none.
 */
export type ResetOptionState = () => void;

/**
 * Creates
 * @param initial The initial parameter.
 * @returns An array containing the state, two set-reset functions and the raw set-state function.
 */
export default function useOptionalState<A>(
  initial?: A
): [
  option<A>,
  SetOptionState<A>,
  ResetOptionState,
  React.Dispatch<React.SetStateAction<option<A>>>
] {
  const [state, setState] = useState<option<A>>(toOption(initial));
  return [state, (value: A) => setState(some(value)), () => setState(none()), setState];
}
