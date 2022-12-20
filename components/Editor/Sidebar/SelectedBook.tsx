import { getBook } from '@/utils/notes';
import {
  updateSelectedBook,
  useAppDispatch,
  useAppSelector,
} from '@/utils/store';
import {
  Box,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import BookSelect from './BookSelect';

const SelectedBook = (): JSX.Element => {
  const bookId = useAppSelector((state) => state.note.bookId);
  const selectedBook = useAppSelector((state) => state.note.selectedBook);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isSubscribed = true;

    (async function () {
      setLoading(true);
      if (!bookId) {
        setLoading(false);
        return;
      }
      const book = await getBook(bookId);
      dispatch(updateSelectedBook(book));
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
