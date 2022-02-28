import { AddIcon } from '@chakra-ui/icons';
import { Text, Grid, GridItem, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { BookNote } from '../../@types/booktypes';
import { useStatus } from '../Status';
import { StatusWrapper } from '../Status';
import { BookCard } from './BookCard';
import { subscribeToCurrentUserNotes } from './subscribeToCurrentUserNotes';

export const BookCards = () => {
  const [cards, setCards] = useState<BookNote[]>([]);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    const unsub = subscribeToCurrentUserNotes((result) => setCards(result));
    return unsub;
  }, []);

  return (
    <StatusWrapper
      status={state.status}
      loading={<div>Loading...</div>}
      error={<div>{state.error}</div>}
    >
      <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
        {cards.length > 0 &&
          cards.map((card) => <BookCard key={card.id} card={card} />)}
        <EmptyCard />
      </Grid>
    </StatusWrapper>
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
