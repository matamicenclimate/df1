import { QueryClient, QueryClientProvider } from 'react-query';
// import { AuthProvider } from '@/context/auth-context';
import { ErrorBoundary } from 'react-error-boundary';
// import { AuthProvider } from '@/lib/auth';
import { UserContextProvider } from '@/context/WalletContext';
import { CauseContextProvider } from '@/context/CauseContext';
import { DialogProvider } from './DialogProvider';
import { WalletFundsContextProvider } from '@/context/WalletFundsContext';
import ModalDialogProvider from './ModalDialogProvider';
import { LanguageContextProvider } from '@/context/LanguageContext';

const queryClient = new QueryClient();

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};

export type ProviderStack = ((children: JSX.Element) => JSX.Element)[];

/**
 * A stack of providers.
 */
const providers = [
  (children) => <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>,
  (children) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  (children) => <UserContextProvider>{children}</UserContextProvider>,
  (children) => <CauseContextProvider>{children}</CauseContextProvider>,
  (children) => <WalletFundsContextProvider>{children}</WalletFundsContextProvider>,
  (children) => <LanguageContextProvider>{children}</LanguageContextProvider>,
  // (children) => <AuthProvider>{children}</AuthProvider>,
  (children) => <DialogProvider>{children}</DialogProvider>,
  (children) => <ModalDialogProvider>{children}</ModalDialogProvider>,
] as ProviderStack;

export const AppProvider = ({ children }: { children: JSX.Element }) =>
  providers.reduceRight((children, mount) => mount(children), children);
