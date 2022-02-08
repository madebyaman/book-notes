import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../utils/useAuth';
import { StoreProvider } from 'easy-peasy';
import { NoteEditorStore } from '../utils/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <StoreProvider store={NoteEditorStore}>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
