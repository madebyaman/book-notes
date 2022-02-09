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
import { Book, BookNoteInterface } from '../@types/booktypes';
import db from '../firebase';
import useStatus from '../utils/useState';

const DefaultBookCover = () => (
  <>
    <Image src="./Book.png" alt="Book Cover" width={'150px'} />
  </>
);

const BookNotesCards = ({ userID }: { userID: string }) => {
  const router = useRouter();
  const [cards, setCards] = useState<BookNoteInterface[]>([]);
  const { state, dispatch } = useStatus();

  useEffect(() => {
    let unsub: () => void;
    try {
      const q = query(
        collection(db, 'book-notes'),
        where('userId', '==', userID)
      );
      unsub = onSnapshot(q, (snap) => {
        const bookNotes: BookNoteInterface[] = [];
        snap.forEach((doc) => {
          const fetchedBookNote = {
            ...(doc.data() as BookNoteInterface),
          };
          // Here push only relavant data like title, stars, book Id, publish status etc.
          bookNotes.push(fetchedBookNote);
        });
        setCards(bookNotes);
      });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: 'Error fetching data' });
    }
    dispatch({ type: 'LOADED' });

    return () => unsub();
  }, [userID]);

  if (state.status === 'LOADING') {
    return <div>Loading...</div>;
  }
  if (state.status === 'ERROR') {
    return <div>{state.error}</div>;
  }
  // Show loading, error, and loaded states
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        {cards.length > 0 &&
          cards.map(({ id, rating, published, title, bookId }) => (
            <GridItem
              p={5}
              key={id}
              shadow="md"
              borderWidth={'1px'}
              flex={'1'}
              borderRadius={'md'}
              minW={'250px'}
            >
              {console.log(cards)}
              {console.log('ID: ', id)}
              <Flex>
                <Box mr={6} mb={4} w={'150px'}>
                  {bookId ? (
                    // Get book cover from Open Library
                    <div>Hello</div>
                  ) : (
                    <DefaultBookCover />
                  )}
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
                    fontWeight={'normal'}
                  >
                    {published ? 'Published' : 'Draft'}
                  </Heading>
                  <Heading as="h2" fontSize="3xl" mt={2} mb={4}>
                    {title || 'Untitled'}
                  </Heading>
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
            onClick={() => router.push('/add-book')}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BookNotesCards;
