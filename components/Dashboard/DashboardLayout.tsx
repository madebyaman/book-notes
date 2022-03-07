import { Box, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { ErrorBoundary } from 'react-error-boundary';

import { Tab } from '.';
import { signout } from '../../utils/auth';
import { AuthContext } from '../Auth';
import { ResendVerificationEmail } from '../Layout/ResendVerificationEmail';
import { UserProfile } from '../../@types';
import { ErrorFallback } from '../Error';
import { getCurrentUserProfile } from '../Profile';

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | undefined>();
  const isDashboardActive = router.pathname === '/dashboard'; // To figure whether the page is dashboard or profile page.
  const userInfo = useContext(AuthContext);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUserProfile();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (e) {
        throw e;
      }
    };
    loadUser();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setUser(undefined);
      }}
      resetKeys={[user]}
    >
      {!userInfo?.emailVerified && (
        <Box backgroundColor={'#FC8181'} textAlign="center">
          <Container py="2">
            Your email is not verified. <ResendVerificationEmail />
          </Container>
        </Box>
      )}
      <Box backgroundColor={'#EDF2F7'}>
        <Container maxW="container.lg" pt={'16'}>
          <Flex justify="center" align={'center'}>
            {user && user.photo ? (
              <Image
                borderRadius={'full'}
                src={user.photo}
                w="100px"
                h="100px"
              />
            ) : (
              <ImUser fontSize={'50px'} />
            )}
            <Box ml={8}>
              <Heading as="h1">Hello {user?.name || 'there'}</Heading>
              <Text ml={1} mt={'2'}>
                {isDashboardActive
                  ? 'Here are book notes'
                  : 'Update your profile here'}
              </Text>
            </Box>
          </Flex>
          <Flex mt={12} justify={'center'}>
            <Tab
              icon={<FiBook />}
              active={isDashboardActive}
              onClick={() => router.push('/dashboard')}
            >
              Book Notes
            </Tab>
            <Tab
              icon={<FiUser />}
              active={!isDashboardActive}
              onClick={() => router.push('/dashboard/profile')}
            >
              Profile
            </Tab>
            <Tab icon={<FiLogOut />} onClick={signout}>
              Logout
            </Tab>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.lg" mt={16} mb={12}>
        {children}
      </Container>
    </ErrorBoundary>
  );
};
