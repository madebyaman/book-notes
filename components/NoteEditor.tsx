import React, { createContext, Dispatch, useReducer } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BookSelect from '../components/BookSelect';
import Editor from '../components/editor';
import Ratings from '../components/Ratings';
import {
  Flex,
  Box,
  Button,
  Stack,
  Container,
  useToast,
  Text,
  Heading,
  IconButton,
  Spacer,
} from '@chakra-ui/react';
import { FaArchive, FaPaperPlane } from 'react-icons/fa';
import ErrorFallback from './ErrorFallback';
import { BookOption } from '../types/BookTypes';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import db from '../firebase';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

type EDITORSTATE = {
  error: null | Error;
  selectedBook: BookOption | null;
  bookNote: string | null;
  rating: number | null;
  isLoading: boolean;
};

type EDITORACTIONS =
  | { type: 'ERROR_FOUND'; payload: any }
  | { type: 'RESET_ERROR' }
  | { type: 'NEW_BOOK_SELECTED'; payload: BookOption | null }
  | { type: 'RESET_SELECTED_BOOK' }
  | { type: 'CHANGE_CONTENT'; payload: string }
  | { type: 'CHANGE_RATING'; payload: number }
  | { type: 'CHANGE_IS_LOADING' };

const reducer = (state: EDITORSTATE, action: EDITORACTIONS) => {
  switch (action.type) {
    case 'ERROR_FOUND':
      return { ...state, error: action.payload };
    case 'RESET_ERROR':
      return { ...state, error: null };
    case 'NEW_BOOK_SELECTED':
      return { ...state, selectedBook: action.payload };
    case 'RESET_SELECTED_BOOK':
      return { ...state, selectedBook: null };
    case 'CHANGE_CONTENT':
      return { ...state, bookNote: action.payload };
    case 'CHANGE_RATING':
      return { ...state, rating: action.payload };
    case 'CHANGE_IS_LOADING':
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
};

// TODO Add user id to the state
const initialEditorState = {
  error: null,
  selectedBook: null,
  bookNote: '<h1>Add a new book</h1>',
  rating: null,
  isLoading: false,
};

export const NoteEditorContext = createContext<{
  state: EDITORSTATE;
  dispatch: Dispatch<EDITORACTIONS>;
}>({
  state: initialEditorState,
  dispatch: () => undefined,
});

const NoteEditor = () => {
  const [state, dispatch] = useReducer(reducer, initialEditorState);
  const { selectedBook, bookNote, rating, isLoading } = state;
  const toast = useToast();
  const router = useRouter();

  const onPublish = () => {
    // Show error if no title | no book selected | no notes | no rating
    if (bookNote && rating) {
      dispatch({ type: 'CHANGE_IS_LOADING' });
      toast({
        title: 'Successfully published',
        description: 'View it live',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        dispatch({ type: 'CHANGE_IS_LOADING' });
      }, 3000);
      // TODO publish when userID is available
    } else {
      if (!bookNote) {
        toast({
          title: 'Add book note',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      if (!rating) {
        toast({
          title: 'Add book rating',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const onSave = async ({
    publish,
    docID,
  }: {
    publish: Boolean;
    docID?: string;
  }) => {
    // Push to firebase
    // If no docID
    if (!docID) {
      const docRef = await addDoc(collection(db, 'book-notes'), {
        book: selectedBook?.id || null,
        content: bookNote,
        rating: rating || null,
        published: publish,
      });
      console.log('Document written with ID:', docRef.id);
    } else {
      // If docID set the document
      const documentRef = doc(db, 'book-notes', docID);
      await updateDoc(documentRef, {
        book: state.selectedBook?.id || null,
        content: state.bookNote,
        rating: state.rating || null,
        published: publish,
      });
      console.log('updated doc', documentRef.id);
    }
  };

  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch({ type: 'RESET_ERROR' })}
      >
        <NoteEditorContext.Provider value={{ state, dispatch }}>
          <Box
            zIndex={'2'}
            position={'fixed'}
            w="100%"
            top="0"
            borderBottom={'1px solid #e9ebf0'}
          >
            <Container maxW={'container.xl'}>
              <Flex color="white" align={'center'} justify={'space-between'}>
                <Box py="4" borderRight={'1px solid #e9ebf0'} pr="4">
                  <IconButton
                    aria-label="Go back"
                    variant={'unstyled'}
                    icon={<ArrowBackIcon color={'blackAlpha.700'} />}
                    onClick={() => router.back()}
                  />
                </Box>
                <Box py="4" color={'blackAlpha.900'}>
                  <Heading as="h1" size="sm">
                    Add a New Book
                  </Heading>
                </Box>
                <Box py="4">
                  <Stack direction={'row'} spacing={6}>
                    <Button
                      leftIcon={<FaPaperPlane />}
                      variant={'solid'}
                      colorScheme={'teal'}
                      onClick={onPublish}
                      isLoading={isLoading}
                    >
                      Publish
                    </Button>
                    <Button
                      leftIcon={<FaArchive />}
                      variant={'outline'}
                      colorScheme={'teal'}
                      isLoading={isLoading}
                    >
                      Save
                    </Button>
                  </Stack>
                </Box>
              </Flex>
            </Container>
          </Box>
          <Flex justify={'space-between'}>
            <Box mt="20" flex={'1'} w="65%" mx="24">
              <Editor />
            </Box>
            <Flex
              mt="28"
              w="30%"
              px="12"
              borderLeft={'1px solid #e9ebf0'}
              minH="calc(100vh - 150px)"
              flexDir={'column'}
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
                      selectedBook.cover
                        ? `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`
                        : 'https://res.cloudinary.com/dksughwo7/image/upload/v1580483332/hacker-journey/aman.png'
                    }
                    alt={selectedBook.label}
                    style={{
                      height: '100px',
                      width: 'auto',
                      marginRight: '15px',
                    }}
                  />
                  <Box>
                    <Heading as="h3" size="sm">
                      {selectedBook?.label}
                    </Heading>
                    <Text>{selectedBook.year}</Text>
                    <Text>{selectedBook.author}</Text>
                  </Box>
                </Flex>
              )}
            </Flex>
          </Flex>
        </NoteEditorContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default NoteEditor;
