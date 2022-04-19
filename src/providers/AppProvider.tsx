import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { AuthProvider } from '@/context/auth-context';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from '@/lib/auth';
import { UserContextProvider } from '@/context/WalletContext';
import { CauseContextProvider } from '@/context/CauseContext';
import { DialogProvider } from './DialogProvider';
import { WalletFundsContextProvider } from '@/context/WalletFundsContext';
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

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <CauseContextProvider>
            <WalletFundsContextProvider>
              <LanguageContextProvider>
                <AuthProvider>
                  <DialogProvider>{children}</DialogProvider>
                </AuthProvider>
              </LanguageContextProvider>
            </WalletFundsContextProvider>
          </CauseContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
