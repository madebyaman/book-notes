import { AddIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Circle,
  CircularProgress,
  Container,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import DashboardCards from '../components/DashboardCards';
import data from '../utils/data.json';
import { useAuth } from '../utils/useAuth';
import { FiLogOut } from 'react-icons/fi';
import { useEffect } from 'react';
import ChakraNextLink from '../components/ChakraNextLink';

const Dashboard: NextPage = function () {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!auth.user) {
      timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [auth]);

  if (!auth.user) {
    return (
      <Container maxW="container.lg" mt="24">
        <Center flexDir={'column'}>
          <Text>
            You are not logged in. Redirecting you back to{' '}
            <ChakraNextLink href="/login">login page.</ChakraNextLink>
          </Text>
          <Box mt="8">
            <CircularProgress isIndeterminate />
          </Box>
        </Center>
      </Container>
    );
  }

  return (
    <Flex justify={'space-between'}>
      <Box backgroundColor={'gray.800'} padding={'5px 20px'} h={'100vh'}>
        <Flex justify={'space-between'} flexDir={'column'}>
          <IconButton
            aria-label="Logout"
            icon={<FiLogOut />}
            onClick={auth.handleSignout}
          />
          {/* Send some message for signed out users. */}
        </Flex>
      </Box>
      <Container maxW="container.lg">
        <Flex justify={'space-between'} mt="12" align={'center'}>
          <Box>
            <Heading as="h1">Dashboard</Heading>
            <Text color={'gray.400'} as="strong">
              Placeholder for some dashboard dangly task.
            </Text>
          </Box>
          <Box>
            <IconButton
              aria-label="Add a new book"
              variant="outline"
              borderRadius={'50%'}
              icon={
                <Circle size="40px" bg="gray.700">
                  <AddIcon color={'white'} />
                </Circle>
              }
              onClick={() => router.push('/add-book')}
            />
          </Box>
        </Flex>
        <DashboardCards initialLoad={3} cardContents={data} />
      </Container>
    </Flex>
  );
};

export default Dashboard;
