import { Container } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const CenteredLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container maxW="container.lg" pt={'16'}>
      {children}
    </Container>
  );
};
