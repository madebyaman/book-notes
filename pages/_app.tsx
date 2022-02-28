import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import { AuthComponent } from '../components/Auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthComponent>
        <Component {...pageProps} />
      </AuthComponent>
    </ChakraProvider>
  );
}

export default MyApp;
