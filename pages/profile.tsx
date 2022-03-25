import { Box, Container } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Nav } from '../components/nav';
import { ProfilePreferences as Profile } from '../components/Profile';

const ProfilePage: NextPage = function () {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Profile preferences</title>
      </Head>
      <Box backgroundColor={'white'} shadow="lg" py="4">
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

export default ProfilePage;
