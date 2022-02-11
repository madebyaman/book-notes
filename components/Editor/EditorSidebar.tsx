import { Text, Flex, Spacer, Box, Heading } from '@chakra-ui/react';
import { useStoreState } from '../../utils/store';
import BookSelect from '../BookSelect';
import Ratings from './Ratings';
import PublishSwitch from './PublishSwitch';

const EditorSidebar = () => {
  const selectedBook = useStoreState((state) => state.selectedBook);

  return (
    <Flex
      pl="8"
      py="10"
      borderLeft={'1px solid #e9ebf0'}
      flexDir={'column'}
      zIndex={'10'}
      height={'calc(100vh - 80px)'}
    >
      <BookSelect />
      <Text fontSize={'md'} mt="12" mb="2">
        How strongly would you recommend it?
      </Text>
      <Ratings />
      <PublishSwitch />
      <Spacer />
      {selectedBook && (
        <Flex bg="gray.100" borderRadius={'md'} p="4" mt={'auto'}>
          {(selectedBook.photoURL || selectedBook.cover) && (
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
          )}
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
