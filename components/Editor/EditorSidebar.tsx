import { Text, Flex, Spacer, Box, Heading } from '@chakra-ui/react';
import { useStoreState } from '../../utils/store';
import BookSelect from '../BookSelect';
import Ratings from '../Ratings';

const EditorSidebar = () => {
  const selectedBook = useStoreState((state) => state.selectedBook);

  return (
    <Flex
      mt="28"
      w="30%"
      px="12"
      borderLeft={'1px solid #e9ebf0'}
      minH="calc(100vh - 150px)"
      flexDir={'column'}
      pos={'fixed'}
      top={'0'}
      right={'0'}
      zIndex={'10'}
    >
      <BookSelect />
      <Text fontSize={'md'} mt="12" mb="2">
        How strongly would you recommend it?
      </Text>
      <Ratings />
      <Spacer />
      {selectedBook && (
        <Flex bg="gray.100" borderRadius={'md'} p="4">
          <img
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
          <Box>
            <Heading as="h3" size="sm">
              {selectedBook?.title}
            </Heading>
            <Text>{selectedBook.year}</Text>
            <Text>{selectedBook.author}</Text>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default EditorSidebar;
