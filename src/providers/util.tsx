export type ProviderList = (React.FC | [React.FC, Record<string, unknown>])[];

export function mount(Component: ProviderList[number], props: Record<string, unknown>) {
  if (typeof Component === 'function') {
    return <Component {...props} />;
  }
  const [C, p] = Component;
  return <C {...{ ...p, ...props }} />;
}

export function nestProviders(children: React.ReactNode, snare: ProviderList) {
  const deepMost = snare.slice(-1).at(0);
  if (deepMost == null) {
    throw new Error("Can't reduce empty array");
  }
  return snare.slice(0, -1).reduceRight((children, provider) => {
    return mount(provider, { children });
  }, mount(deepMost, { children }));
}
