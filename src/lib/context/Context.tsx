import { FC } from 'react';

export type ContextOptions = () => any[];

const container: Record<string, FC> = {};

export default function Context(options?: ContextOptions) {
  return function ContextDecorator(fc: FC) {};
}
