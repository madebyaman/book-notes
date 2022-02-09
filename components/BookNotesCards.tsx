import { AddIcon, StarIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  IconButton,
  Image,
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
              shadow="md"
              borderWidth={'1px'}
              flex={'1'}
              borderRadius={'md'}
              minW={'250px'}
              mt="12"
            >
              <Flex direction={'column'} align="center">
                <Box
                  mr={6}
                  mb={4}
                  w={'150px'}
                  // transform="rotateZ(10deg)"
                  mt="-16"
                >
                  <BookCover bookID={bookId} />
                </Box>
                <Box>
                  <Heading
                    as="h3"
                    fontSize={'12px'}
                    textTransform={'uppercase'}
                    letterSpacing={'wider'}
                    p={2}
                    backgroundColor={'gray.100'}
                    display={'inline-block'}
                    borderRadius={'md'}
                    fontWeight={'bold'}
                  >
                    {published ? 'Published' : 'Draft'}
                  </Heading>
                  <Heading as="h2" fontSize="3xl" mt={2} mb={4}>
                    {title || 'Untitled'}
                  </Heading>
                  {excerpt && (
                    <Box>
                      <Text>{excerpt}</Text>
                    </Box>
                  )}
                  <Box mb={4}>
                    {rating
                      ? [...Array(rating)].map((_i, id) => (
                          <StarIcon key={id} color="gray.500" />
                        ))
                      : 'No rating'}
                  </Box>
                  <Link
                    href={{
                      pathname: '/edit/[id]',
                      query: { id: id },
                    }}
                  >
                    <a>Edit</a>
                  </Link>
                </Box>
              </Flex>
            </GridItem>
          ))}
        <GridItem
          shadow="md"
          borderWidth={'1px'}
          flex={'1'}
          borderRadius={'md'}
          minW={'250px'}
          minH={'250px'}
        >
          <IconButton
            colorScheme={'blackAlpha'}
            variant={'unstyled'}
            aria-label="Add book"
            icon={<AddIcon />}
            w={'100%'}
            h={'100%'}
            borderRadius={'md'}
            onClick={() => router.push('/add')}
          />
        </GridItem>
      </Grid>
    </Status>
  );
};

export default BookNotesCards;
