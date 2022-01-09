import React, { createContext, Dispatch, useEffect, useReducer } from 'react';
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

import db from '../firebase';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/useAuth';
import {
  addDoc,
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

type EDITORSTATE = {
  error: null | Error;
  selectedBook: BookOption | null;
  bookNote: string | null;
  rating: number | null;
  isLoading: boolean;
  title: string | undefined;
  bookID: string | undefined;
};

type EDITORACTIONS =
  | { type: 'ERROR_FOUND'; payload: any }
  | { type: 'RESET_ERROR' }
  | { type: 'NEW_BOOK_SELECTED'; payload: BookOption | null }
  | { type: 'RESET_SELECTED_BOOK' }
  | { type: 'CHANGE_CONTENT'; payload: string }
  | { type: 'CHANGE_RATING'; payload: number }
  | { type: 'CHANGE_IS_LOADING' }
  | { type: 'CHANGE_TITLE'; payload: string };

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
    case 'CHANGE_TITLE':
      return { ...state, title: action.payload };
    default:
      return state;
  }
};

// TODO Add user id to the state
const initialEditorState = {
  error: null,
  selectedBook: null,
  bookNote: '',
  rating: null,
  isLoading: false,
  title: undefined,
  bookID: undefined,
};

export const NoteEditorContext = createContext<{
  state: EDITORSTATE;
  dispatch: Dispatch<EDITORACTIONS>;
}>({
  state: initialEditorState,
  dispatch: () => undefined,
});

const NoteEditor = ({ docId }: { docId: string }) => {
  const [state, dispatch] = useReducer(reducer, initialEditorState);
  const { title, bookID, selectedBook, bookNote, rating, isLoading } = state;
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchDoc() {
      if (docId) {
        const docRef = doc(db, 'book-notes', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { content, rating, title, bookID, published } = docSnap.data();
          dispatch({ type: 'CHANGE_CONTENT', payload: content });
          dispatch({ type: 'CHANGE_RATING', payload: rating });
          dispatch({ type: 'CHANGE_TITLE', payload: title });
          if (bookID) {
            // Get `books` collection and dispatch to selectedState
            const bookRef = doc(db, 'books', bookID);
            const bookSnap = (await getDoc(
              bookRef
            )) as DocumentSnapshot<BookOption>;
            if (bookSnap.exists()) {
              dispatch({ type: 'NEW_BOOK_SELECTED', payload: bookSnap.data() });
            }
          }
        }
      }
    }
    fetchDoc();
  }, [docId]);

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
    publish = false,
  }: {
    publish?: Boolean;
    docID?: string;
  }) => {
    // Push to firebase
    // If no docID
    const document = {
      content: bookNote,
      rating: rating || null,
      published: publish,
      userId: auth.authState.useStatusState.state.uid,
      title: title,
      bookID,
    };
    if (bookID) {
      // set a new selected book
      const docRef = doc(db, 'books', bookID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
        const docRef = await addDoc(collection(db, 'books'), selectedBook);
        document.bookID = docRef.id;
      }
      // But if there is a document with id, then don't do it.
    }
    if (!docId) {
      const docRef = await addDoc(collection(db, 'book-notes'), document);
    } else {
      // If docID set the document
      const documentRef = doc(db, 'book-notes', docId);
      await updateDoc(documentRef, document);
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
            backgroundColor={'white'}
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
                      onClick={() => onSave({ publish: false })}
                    >
                      Save
                    </Button>
                  </Stack>
                </Box>
              </Flex>
            </Container>
          </Box>
          <Box mt="20" flex={'1'} w="60%" mx="24">
            <Editor />
          </Box>
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
        </NoteEditorContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export default NoteEditor;
