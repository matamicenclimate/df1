import './App.css';
import './i18n/config';
import { AppProvider } from '@/providers/AppProvider';
import { AppRouter } from './routes/AppRouter';
import AppGuard from './componentes/AppGuard';

function App() {
  return (
    <AppGuard>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AppGuard>
  );
}

export default App;
