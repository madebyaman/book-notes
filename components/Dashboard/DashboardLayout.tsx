import { Box, Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '../Error';
import { Nav } from '../nav';
import { BookCards } from './BookCards';

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box backgroundColor={'white'} shadow="md" py="4">
        <Container maxW="container.lg">
          <Nav showFullNav={true} route={router.pathname} />
        </Container>
      </Box>
      <Box backgroundColor="gray.100" py="16">
        <Container maxW="container.lg">
          <BookCards />
        </Container>
      </Box>
    </ErrorBoundary>
  );
};
