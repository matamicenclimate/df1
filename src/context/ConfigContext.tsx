import { createContext } from 'react';

export interface ConfigurationLike {
  readonly minBidPart: number;
}

export class ConfigNotLoadedError extends Error {
  constructor() {
    super('Configuration not loaded yet! Use the context and ensure that the provider was loaded.');
  }
}

export class NullConfiguration implements ConfigurationLike {
  get minBidPart(): number {
    throw new ConfigNotLoadedError();
  }
}

const ConfigContext = createContext<ConfigurationLike>(new NullConfiguration());

export default class Configuration implements ConfigurationLike {
  constructor(readonly minBidPart: number) {}
  static get Context() {
    return ConfigContext;
  }
  static Provider({ children, config }: { config: ConfigurationLike; children: JSX.Element }) {
    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
  }
}
