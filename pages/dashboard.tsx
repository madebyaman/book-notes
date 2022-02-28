import {
  Box,
  Center,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { useState } from 'react';
import { BookCards, Tab } from '../components/Dashboard';
import Profile from '../components/Profile';
import { signout, useAuth } from '../utils/auth';

const Dashboard: NextPage = function () {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  // const auth = useAuth(); // TODO

  // Sometimes it takes a second to load initial state
  // return (
  //   <Container maxW="container.lg" mt="24">
  //     <Center flexDir={'column'}>
  //       <Text>Loading</Text>
  //       <Box mt="8">
  //         <CircularProgress isIndeterminate />
  //       </Box>
  //     </Center>
  //   </Container>
  // );
  return (
    <Box>
      <Box backgroundColor={'gray.50'}>
        <Container maxW="container.lg" pt={'16'}>
          <Flex justify="center" align={'center'}>
            {/* {auth.user.photoURL ? ( // TODO */}
            {/* <Image
                borderRadius={'full'}
                src={auth.user.photoURL}
                w="100px"
                h="100px"
              />
            ) : ( */}
            <ImUser fontSize={'50px'} />
            {/* )} */}
            <Box ml={8}>
              <Heading as="h1">
                {/* Hello {auth.user.displayName || 'there'} // TODO */}
                Hello
              </Heading>
              <Text ml={1} mt={'2'}>
                {activeTab === 0 && 'Here are book notes'}
                {activeTab === 1 && 'Update your profile here'}
              </Text>
            </Box>
          </Flex>
          <Flex mt={12} justify={'center'}>
            <Tab
              icon={<FiBook />}
              active={activeTab === 0}
              onClick={() => setActiveTab(0)}
            >
              Book Notes
            </Tab>
            <Tab
              icon={<FiUser />}
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
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
        {activeTab === 0 && user && <BookCards userID={user.id} />}
        {activeTab === 1 && <Profile />}
      </Container>
    </Box>
  );
};

export default Dashboard;
