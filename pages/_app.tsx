import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';

import '../styles/globals.css';
import { AuthContextProvider } from '../components/Auth';
import ErrorFallback from '../components/ErrorFallback';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
