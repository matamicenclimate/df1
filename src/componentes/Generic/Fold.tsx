/*
  This module contains integration components for
  @octantis/option module.
*/
import { option } from '@octantis/option';
import { ReactElement } from 'react';

export interface FoldingProps<A> {
  children?: ReactElement;
  option: option<A>;
  as: (value: A) => ReactElement | undefined | null;
}

export default function Fold<A>({ option, as, children }: FoldingProps<A>): ReactElement | null {
  return option.fold(children, as) ?? null;
}
