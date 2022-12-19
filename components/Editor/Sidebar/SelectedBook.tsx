import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from '@/utils/store';
import BookSelect from './BookSelect';

const SelectedBook = (): JSX.Element => {
  const { bookId, selectedBook } = useStoreState((state) => state);
  const fetchBook = useStoreActions((state) => state.fetchBook);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    (async function () {
      setLoading(true);
      bookId && (await fetchBook({ bookId, isSubscribed }));
      setLoading(false);
    })();

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CircularProgress isIndeterminate color="primary.400" />;
  }

  return (
    <>
      <BookSelect />
      {selectedBook && (
        <Flex bg="light.100" borderRadius={'md'} p="4" my="4">
          {(selectedBook.photoURL || selectedBook.cover) && (
            <Image
              src={
                selectedBook.photoURL
                  ? selectedBook.photoURL
                  : `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`
              }
              alt={selectedBook.title}
              style={{
                height: '100px',
                width: 'auto',
                marginRight: '15px',
              }}
            />
          )}
          <Box>
            <Heading as="h4" size="sm">
              {selectedBook?.title}
            </Heading>
            <Text>{selectedBook.year}</Text>
            <Text>{selectedBook.author}</Text>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default SelectedBook;
