import React from 'react';

export interface CaseLikeProps<T> {
  of: T;
  children?: Record<string, unknown>;
  then?: (of: T) => React.ReactElement | string;
}

/**
 * Renders the first case-like element found.
 */
export const Match = <T, P extends CaseLikeProps<T>>({
  children,
}: {
  children: React.ReactElement<P> | React.ReactElement<P>[];
}) => {
  const c = children instanceof Array ? children : [children];
  const found = c.find((s) => s.props.of)?.props;
  if (found) {
    return found.then?.(found.of) ?? found.children ?? null;
  }
  return null;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
function ignore(..._: unknown[]) {
  return;
}

export function Case<T>(_: CaseLikeProps<T>) {
  ignore(_);
  return <></>;
}
