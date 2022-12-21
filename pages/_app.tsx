import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { createStandaloneToast } from '@chakra-ui/react';

import '../styles/globals.css';
import '../styles/typography.css';
import { AuthContextProvider } from '@/components/Auth';
import ErrorFallback from '@/components/ErrorFallback';
import { theme } from '@/components';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const { ToastContainer } = createStandaloneToast();
  return (
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthContextProvider>
          <Head>
            <title>Bummaries App</title>
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
