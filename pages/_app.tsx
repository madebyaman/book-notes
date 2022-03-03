import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import { AuthContextProvider } from '../components/Auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
