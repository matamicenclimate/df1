import './i18n/config';
import '@common/src/blockchain/algorand/algosdk/index';
import { AppProvider } from '@/providers/AppProvider';
import { AppRouter } from './routes/AppRouter';
import AppGuard from './componentes/AppGuard';
import Configuration, { ConfigurationLike } from './context/ConfigContext';

function App({ config }: { config: ConfigurationLike }) {
  return (
    <AppGuard>
      <Configuration.Provider config={config}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </Configuration.Provider>
    </AppGuard>
  );
}

export default App;
