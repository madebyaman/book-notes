import { Container, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

const ErrorFetchingNote = () => {
  return (
    <Container mt={8}>
      <Heading mb={4}>Your book note was not found</Heading>
      <Text>
        Wanna add a new note?{' '}
        <Link href="/add" passHref>
          <ChakraLink color={'teal.500'}>Add a new note</ChakraLink>
        </Link>
      </Text>
    </Container>
  );
};

export default ErrorFetchingNote;
