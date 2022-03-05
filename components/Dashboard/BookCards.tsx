import { AddIcon } from '@chakra-ui/icons';
import { Text, Grid, GridItem, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { BookNote } from '../../@types/booktypes';
import { ErrorFallbackWithRecovery as ErrorFallback } from '../ErrorFallback/ErrorFallbackWithRecovery';
import { useStatus } from '../Status';
import { StatusWrapper } from '../Status';
import { BookCard } from './BookCard';
import { subscribeToCurrentUserNotes } from './subscribeToCurrentUserNotes';

export const BookCards = () => {
  const router = useRouter();
  const [cards, setCards] = useState<BookNote[]>([]);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    const setBooks = async () => {
      try {
        const unsub = await subscribeToCurrentUserNotes((result) => {
          dispatch({ type: 'LOADING' });
          setCards(result);
          dispatch({ type: 'LOADED' });
        });
        return unsub;
      } catch (e) {
        throw e;
      }
    };
    setBooks();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setCards([]);
      }}
      resetKeys={[cards]}
    >
      <StatusWrapper
        status={state.status}
        loading={<div>Loading...</div>}
        error={<div>{state.error}</div>}
      >
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
          {cards.length > 0 ? (
            cards.map((card) => <BookCard key={card.id} card={card} />)
          ) : (
            <EmptyCard />
          )}
        </Grid>
        <Flex
          pos={'fixed'}
          bottom="10"
          right="10"
          backgroundColor={'teal'}
          borderRadius="md"
          cursor="pointer"
          aria-label="Add a new note"
          p="4"
          gap="2"
          boxShadow={'xl'}
          alignItems="center"
          transition={'transform 200ms ease-out'}
          color="white"
          onClick={() => router.push('/add')}
          _hover={{
            transform: 'translateY(-5px)',
          }}
        >
          <AddIcon />
          <Text>Add a new note</Text>
        </Flex>
      </StatusWrapper>
    </ErrorBoundary>
  );
};

const EmptyCard = () => {
  const router = useRouter();
  return (
    <GridItem
      borderWidth={'1px'}
      flex={'1'}
      borderRadius={'md'}
      minW={'250px'}
      minH={'250px'}
      p={5}
      _hover={{ boxShadow: 'md' }}
      cursor="pointer"
      mt="12"
      onClick={() => router.push('/add')}
    >
      <Flex
        w={'100%'}
        h={'100%'}
        flexDir={'column'}
        justify="center"
        align={'center'}
      >
        <AddIcon mb={'4'} />
        <Text>Add a new book note</Text>
      </Flex>
    </GridItem>
  );
};
