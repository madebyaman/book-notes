import { AddIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardNote } from '../@types/booktypes';
import db from '../firebase';
import useStatus from '../utils/useStatus';
import BookCover from './BookCover';
import Status from './Status';

const BookNotesCards = ({ userID }: { userID: string }) => {
  const router = useRouter();
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
            published: data.published,
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
    <Status
      status={state.status}
      loading={<div>Loading...</div>}
      error={<div>{state.error}</div>}
    >
      <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
        {cards.length > 0 &&
          cards.map(({ id, rating, published, title, bookId, excerpt }) => (
            <GridItem
              p={5}
              key={id}
              _hover={{ boxShadow: 'md' }}
              cursor="pointer"
              borderWidth={'1px'}
              flex={'1'}
              minW={'250px'}
              mt="12"
            >
              <Flex direction={'column'} px="4">
                <Box mb={4} w={'150px'} mt="-16">
                  <BookCover bookID={bookId} />
                </Box>
                <Box>
                  <Heading as="h2" fontSize="3xl" mt={2} mb={1}>
                    {title || 'Untitled'}
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={'10px'}
                    textTransform={'uppercase'}
                    letterSpacing={'wider'}
                    p={1}
                    backgroundColor={'gray.50'}
                    display={'inline-block'}
                    color={'gray.600'}
                  >
                    {published ? 'Published' : 'Draft'}
                  </Heading>
                  {excerpt && (
                    <Box>
                      <Text>{excerpt}</Text>
                    </Box>
                  )}
                  <Flex justify={'flex-start'}>
                    <Link
                      href={{
                        pathname: '/edit/[id]',
                        query: { id: id },
                      }}
                    >
                      <a>Edit</a>
                    </Link>
                    <Link
                      href={{
                        pathname: '/edit/[id]',
                        query: { id: id },
                      }}
                    >
                      <a>View it live</a>
                    </Link>
                  </Flex>
                </Box>
              </Flex>
            </GridItem>
          ))}
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
      </Grid>
    </Status>
  );
};

export default BookNotesCards;
