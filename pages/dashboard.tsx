import { AddIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Circle,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import UserContextProvider, { UserContext } from '../components/UserContext';
import data from '../utils/data.json';

const Dashboard: NextPage = function () {
  const { state } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!state.user) {
      router.push('/login');
    }
  }, []);

  return (
    <UserContextProvider>
      <Container maxW="container.lg">
        <Flex justify={'space-between'} mt="12" align={'center'}>
          <Box>
            <Heading as="h1">Dashboard</Heading>
            <Text color={'gray.400'} as="strong">
              Placeholder for some dashboard dangly task.
            </Text>
          </Box>
          <Box>
            <Circle size="40px" bg="gray.700">
              <AddIcon color={'white'} />
            </Circle>
          </Box>
        </Flex>
        <DashboardCards initialLoad={3} cardContents={data} />
      </Container>
    </UserContextProvider>
  );
};

export default Dashboard;
