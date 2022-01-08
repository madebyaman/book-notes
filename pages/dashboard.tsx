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
import { useRouter } from 'next/router';
import data from '../utils/data.json';
import { useAuth } from '../utils/useAuth';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ChakraNextLink from '../components/ChakraNextLink';
import md5 from 'md5';
import Tab from '../components/Tab';
import BookNotesCards from '../components/BookNotesCards';

const Dashboard: NextPage = function () {
  const [gravatarHash, setGravatarHash] = useState<String | null>(null);
  const [activeTab, setActiveTab] = useState(0);
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

  useEffect(() => {
    if (gravatarHash === null && auth.user) {
      setGravatarHash(md5(auth.user.email.toLowerCase()));
    }
  }, [auth]);

  if (!auth.user) {
    // Sometimes it takes a second to load initial state
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
    <Box>
      <Box backgroundColor={'gray.50'}>
        <Container maxW="container.lg" pt={'16'}>
          <Flex justify="center">
            <Image
              borderRadius={'full'}
              src={`https://www.gravatar.com/avatar/${gravatarHash}`}
            />
            <Box ml={8}>
              <Heading as="h1">Hello {auth.user.name}</Heading>
              <Text ml={1} mt={'2'}>
                Here are book notes
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
            <Tab icon={<FiLogOut />} onClick={auth.handleSignout}>
              Logout
            </Tab>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.lg" mt={16} mb={12}>
        {activeTab === 0 && <BookNotesCards cardContents={data} />}
      </Container>
    </Box>
  );
};

export default Dashboard;
