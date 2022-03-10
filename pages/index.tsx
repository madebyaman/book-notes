import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Nav } from '../components/nav';

const Home: NextPage = function () {
  const router = useRouter();

  return (
    <div>
      <Container maxW="container.lg">
        <Nav />
        <Flex
          alignItems={'center'}
          justifyContent="space-between"
          gap="6"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box>
            <Heading as="h1" fontSize={'54px'} color="text.400">
              Write, publish, and share your book notes with ease
            </Heading>
            <Text fontSize={'22px'} color="gray.500" my="8">
              Boomaries is a powerful app to help your write your book notes and
              share them with other people.
            </Text>
            <Button
              textTransform={'uppercase'}
              rounded="md"
              px="8"
              py="6"
              backgroundColor={'primary.700'}
              fontWeight="bold"
              color="white"
              _hover={{
                backgroundColor: 'teal.700',
              }}
              // color="white"
              onClick={() => router.push('/signin')}
            >
              Start writing book notes
            </Button>
          </Box>
          <Box>
            <Box
              backgroundColor={'gray.100'}
              width="450px"
              height="600px"
              boxShadow={'md'}
            />
          </Box>
        </Flex>
      </Container>
    </div>
  );
};

export default Home;
