import {
  Text,
  Flex,
  Spacer,
  Box,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  FormLabel,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

import { useStoreActions, useStoreState } from '../store';
import BookSelect from './BookSelect';
import Ratings from './Ratings';
import PublishSwitch from './PublishSwitch';
import { checkNoteSlugExists } from '../../../utils/notes';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Auth';

export const EditorSidebar = ({ docId }: { docId?: string }) => {
  const user = useContext(AuthContext);
  const selectedBook = useStoreState((state) => state.selectedBook);
  const slug = useStoreState((state) => state.slug);
  const updateSlug = useStoreActions((state) => state.updateSlug);
  const [slugValid, setSlugValid] = useState(true);
  const onBlurSlug = async () => {
    if (user && (await checkNoteSlugExists({ slug, userId: user.id, docId }))) {
      setSlugValid(false);
    } else {
      setSlugValid(true);
    }
  };

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
      <FormLabel my="12">
        <Text fontSize={'sm'} mb="1">
          Slug
        </Text>
        <InputGroup>
          <Input
            value={slug}
            onChange={(e) => updateSlug(e.target.value)}
            placeholder={'Slug'}
            onBlur={onBlurSlug}
          />
          <InputRightElement
            children={
              slugValid ? (
                <CheckCircleIcon color="green.500" />
              ) : (
                <WarningIcon color="red.500" />
              )
            }
          />
        </InputGroup>
      </FormLabel>
      <Text fontSize={'md'} mb="2">
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
