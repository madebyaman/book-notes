import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';

import '../styles/globals.css';
import { AuthContextProvider } from '../components/Auth';
import ErrorFallback from '../components/ErrorFallback';
import { theme } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
