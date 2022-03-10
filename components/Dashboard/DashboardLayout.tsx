import { Box, Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AuthContext } from '../Auth';
import { ErrorFallback } from '../Error';
import { Nav } from '../nav';
import { BookCards } from './BookCards';

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const isDashboardActive = router.pathname === '/dashboard'; // To figure whether the page is dashboard or profile page.
  const userInfo = useContext(AuthContext);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box>
        <Container maxW="container.lg">
          <Nav showFullNav={true} />
        </Container>
      </Box>
      <BookCards />
    </ErrorBoundary>
  );
};
