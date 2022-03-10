import { Box, Container } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Nav } from '../components/nav';
import { ProfilePreferences as Profile } from '../components/Profile';

const Dashboard: NextPage = function () {
  const router = useRouter();

  return (
    <>
      <Box backgroundColor={'white'} shadow="md" py="4">
        <Container maxW="container.lg">
          <Nav showFullNav={true} route={router.pathname} />
        </Container>
      </Box>
      <Box py="16" backgroundColor={'gray.100'}>
        <Container maxW="container.lg">
          <Profile />
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
