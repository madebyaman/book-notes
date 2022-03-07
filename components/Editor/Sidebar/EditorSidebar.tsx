import { Text, Flex, Spacer, Box, Heading, Input } from '@chakra-ui/react';
import { useStoreActions, useStoreState } from '../store';
import BookSelect from './BookSelect';
import Ratings from './Ratings';
import PublishSwitch from './PublishSwitch';
import { checkNoteSlugExists } from '../../../utils/notes';
import { useContext } from 'react';
import { AuthContext } from '../../Auth';

export const EditorSidebar = () => {
  const user = useContext(AuthContext);
  const selectedBook = useStoreState((state) => state.selectedBook);
  const slug = useStoreState((state) => state.slug);
  const updateSlug = useStoreActions((state) => state.updateSlug);

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
      <Input
        value={slug}
        onChange={(e) => updateSlug(e.target.value)}
        placeholder={'slug'}
        onBlur={() => user && checkNoteSlugExists({ slug, userId: user?.id })}
      />
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
