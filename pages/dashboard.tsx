import { Box, Container } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { BookCards } from '../components/Dashboard';
import { Nav } from '../components/nav';

const Dashboard: NextPage = function () {
  const router = useRouter();

  return (
    <>
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
    </>
  );
};

export default Dashboard;
