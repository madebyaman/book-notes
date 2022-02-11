import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  Flex,
  Button,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardNote } from '../@types/booktypes';
import db from '../firebase';
import useStatus from '../utils/useStatus';
import BookCover from './BookCover';
import ChakraNextLinkButton from './ChakraNextLink';
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
              borderColor={'gray.100'}
            >
              <Flex direction={'column'} px="4">
                <Box mb={4} w={'150px'} mt="-16">
                  <BookCover bookID={bookId} />
                </Box>
                <Box mt="auto">
                  <Text
                    fontSize={'10px'}
                    textTransform={'uppercase'}
                    letterSpacing={'wider'}
                    p={1}
                    backgroundColor={'gray.100'}
                    display={'inline-block'}
                    color={'gray.600'}
                  >
                    {published ? 'Published' : 'Draft'}
                  </Text>
                  <Heading as="h2" fontSize="3xl" mt={0} mb={2}>
                    {title || 'Untitled'}
                  </Heading>
                  {excerpt && (
                    <Box>
                      <Text>{excerpt}</Text>
                    </Box>
                  )}
                  <Flex justify={'flex-start'} alignItems="center" mt={4}>
                    <Link
                      href={{
                        pathname: '/edit/[id]',
                        query: { id: id },
                      }}
                      passHref
                    >
                      <Button
                        colorScheme={'teal'}
                        borderRadius="0"
                        mr="4"
                        rightIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Link href={'/edit'} passHref>
                      <ChakraLink color="teal.500">View it live</ChakraLink>
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
