import { AddIcon } from '@chakra-ui/icons';
import { Text, Grid, GridItem, Flex } from '@chakra-ui/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DashboardNote } from '../../@types/booktypes';
import db from '../../firebase';
import { useStatus } from '../Status';
import { StatusWrapper } from '../Status';
import { BookCard } from './BookCard';

export const BookCards = ({ userID }: { userID: string }) => {
  const [cards, setCards] = useState<DashboardNote[]>([]);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    let unsub: () => void;
    try {
      const q = query(
        collection(db, 'book-notes'),
        where('userId', '==', userID)
      );
      unsub = onSnapshot(q, (snap) => {
        const bookNotes: DashboardNote[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          bookNotes.push({
            id: doc.id,
            bookId: data.bookId,
            title: data.title,
            rating: data.rating,
            isPublished: data.isPublished,
            lastUpdated: data.lastUpdated,
            excerpt: data.excerpt,
          });
        });
        setCards(bookNotes);
      });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: 'Error fetching data' });
    }
    dispatch({ type: 'LOADED' });

    return () => unsub();
  }, [userID]);

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
