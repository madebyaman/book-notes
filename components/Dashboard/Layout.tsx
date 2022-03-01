import { Box, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';

import { Tab } from '.';
import { CustomUser } from '../../@types/types';
import { signout } from '../../utils/auth';
import { getCurrentUserInfo } from '../Profile';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<CustomUser | undefined>();
  const isDashboardActive = router.pathname === '/dashboard';

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUserInfo();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    loadUser();
  }, []);

  return (
    <>
      <Box backgroundColor={'gray.50'}>
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
    </>
  );
};
