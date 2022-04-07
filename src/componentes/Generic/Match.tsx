import React from 'react';

export interface CaseLikeProps<T> {
  of: T;
  children?: any;
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

export function Case<T>(_: CaseLikeProps<T>) {
  return <></>;
}
