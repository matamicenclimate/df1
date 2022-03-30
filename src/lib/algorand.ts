import { Lazy } from '@common/src/lib/Lazy';
import AlgodClientProvider from '@common/src/services/AlgodClientProvider';
import Container from 'typedi';

const service = Container.get(AlgodClientProvider);

export const client = Lazy(() => service.client);
