import { Button, Container, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = function () {
  const router = useRouter();

  return (
    <main style={{ backgroundColor: '#F7FAFC', minHeight: '100vh' }}>
      <Container maxW="container.lg" textAlign="center">
        <Heading as="h1" pt="32" fontSize={'54px'}>
          Write, publish, and share your book notes with ease
        </Heading>
        <Container>
          <Text fontSize={'24px'} color="gray.500" my="8">
            Boomaries is a powerful app to help your write your book notes and
            share them with other people.
          </Text>
          <Button
            textTransform={'uppercase'}
            rounded="none"
            px="8"
            py="5"
            colorScheme={'teal'}
            onClick={() => router.push('/signin')}
          >
            Start writing book notes
          </Button>
        </Container>
      </Container>
    </main>
  );
};

export default Home;
