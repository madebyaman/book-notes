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
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import db from '../firebase';
import { useAuth } from '../utils/useAuth';

const DefaultBookCover = () => (
  <>
    <Image src="./Book.png" alt="Book Cover" width={'150px'} />
  </>
);

const BookNotesCards = ({ userID }: { userID: string }) => {
  const router = useRouter();
  const [cards, setCards] = useState();

  useEffect(() => {
    let unsub: () => void;
    const q = query(
      collection(db, 'book-notes'),
      where('userId', '==', userID)
    );
    unsub = onSnapshot(q, (snap) => {
      const newCards = [];
      snap.forEach((doc) => {
        // Here push only relavant data like title, stars, book Id, publish status etc.
        newCards.push({ id: doc.id, ...doc.data() });
      });
      setCards(newCards);
    });

    return () => unsub();
  }, []);
  // Show loading, error, and loaded states
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        {cards &&
          cards.map((item, id) => (
            <GridItem
              key={id}
              p={5}
              shadow="md"
              borderWidth={'1px'}
              flex={'1'}
              borderRadius={'md'}
              minW={'250px'}
            >
              <Flex>
                <Box mr={6} mb={4} w={'150px'}>
                  {/* Show default book cover ONLY IF no book ID, else get cover from Open Library */}
                  <DefaultBookCover />
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
                    {item.published ? 'Published' : 'Draft'}
                  </Heading>
                  <Heading as="h2" fontSize="3xl" mt={2} mb={4}>
                    {item.title || 'Untitled'}
                  </Heading>
                  <Box mb={4}>
                    {item.rating
                      ? [...Array(item.rating)].map((_i, id) => (
                          <StarIcon key={id} color="gray.500" />
                        ))
                      : 'No rating'}
                  </Box>
                  <Link
                    href={{
                      pathname: '/edit/[id]',
                      query: { id: item.id },
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
